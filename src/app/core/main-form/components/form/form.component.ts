import { NgIf } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { InputRow } from "../../../../models/input-row";
import { InputsRowComponent } from "../inputs-row/inputs-row.component";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../../../services/api.service";
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-form",
  standalone: true,
  imports: [FormsModule, NgIf, InputsRowComponent, NgbAlert],
  templateUrl: "./form.component.html",
  styleUrl: "./form.component.css"
})
export class FormComponent {
  @Output() setResultsFromFormEventEmitter = new EventEmitter();

  isLoading = false;
  inputRows: InputRow[] = [new InputRow()];
  errors: { [key: string]: number[] } = { divider: [], remainder: [], limit: [] };
  serverError: string = "";

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
          // resp = [{ divider: 7, remainder: 5, limit: 12345, result: 12339 }];
          if (resp.notification.code === 200) {
            this.setResultsFromFormEventEmitter.emit(resp.data);
          } else {
            this.serverError = resp?.notification?.description || "";
          }
          this.isLoading = false;
        },
        error: (error) => console.error("Error in fetchMaximumGET", error)
      });
    } else if (this.inputRows.length > 1) {
      console.log("llamada post", this.inputRows);
      this.apiService.fetchMaximumPOST(this.inputRows).subscribe({
        next: (resp) => {
          // resp = [
          //   { divider: 7, remainder: 5, limit: 12345, result: 12339 },
          //   { divider: 7, remainder: 5, limit: 12345, result: 12339 }
          // ];
          if (resp.notification.code === 200) {
            this.setResultsFromFormEventEmitter.emit(resp.data);
          } else {
            this.serverError = resp?.notification?.description || "";
          }
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
