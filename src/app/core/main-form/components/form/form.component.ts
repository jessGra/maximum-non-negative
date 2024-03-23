import { NgIf } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { InputRow } from "../../../../models/input-row";
import { InputsRowComponent } from "../inputs-row/inputs-row.component";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../../../services/api.service";

@Component({
  selector: "app-form",
  standalone: true,
  imports: [FormsModule, NgIf, InputsRowComponent],
  templateUrl: "./form.component.html",
  styleUrl: "./form.component.css"
})
export class FormComponent {
  @Output() getResultsFromFormEventEmitter = new EventEmitter();

  isLoading = false;
  inputRows: InputRow[] = [new InputRow()];
  errors: { [key: string]: number[] } = { divider: [], remainder: [], limit: [] };

  constructor(private apiService: ApiService) {}

  addCase() {
    this.inputRows.push(new InputRow());
  }

  deleteRow(index: number) {
    this.inputRows.splice(index, 1);
  }

  calculate() {
    if (!this.validate()) return;

    this.isLoading = true;

    if (this.inputRows.length === 1) {
      console.log("llamada get", this.inputRows[0]);
      this.apiService.fetchMaximumGET(this.inputRows[0]).subscribe({
        next: (resp) => {
          // resp = [{ x: 7, y: 5, n: 12345, resp: 12339 }];
          this.getResultsFromFormEventEmitter.emit(resp);
          this.isLoading = false;
        },
        error: (error) => console.error("Error in fetchMaximumGET", error)
      });
    } else if (this.inputRows.length > 1) {
      console.log("llamada post", this.inputRows);
      this.apiService.fetchMaximumPOST(this.inputRows).subscribe({
        next: (resp) => {
          // resp = [
          //   { x: 7, y: 5, n: 12345, resp: 12339 },
          //   { x: 7, y: 5, n: 12345, resp: 12339 }
          // ];
          this.getResultsFromFormEventEmitter.emit(resp);
          this.isLoading = false;
        },
        error: (error) => console.error("Error in fetchMaximumPOST", error)
      });
    }
  }

  validate() {
    this.errors = { divider: [], remainder: [], limit: [] };
    let isValid = true;

    this.inputRows.forEach((row, index) => {
      if (!row.divider || isNaN(row.divider) || row.divider < 2 || row.divider > 1000000000) {
        this.errors["divider"].push(index);
        isValid = false;
      }

      if (!row.remainder || isNaN(row.remainder) || row.remainder < 0 || row.remainder >= row.divider) {
        this.errors["remainder"].push(index);
        isValid = false;
      }

      if (!row.limit || isNaN(row.limit) || row.limit < row.remainder || row.limit > 1000000000) {
        this.errors["limit"].push(index);
        isValid = false;
      }
    });

    return isValid;
  }
}
