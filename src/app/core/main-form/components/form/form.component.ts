import { NgIf } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { InputRow } from "../../../../models/input-row";
import { InputsRowComponent } from "../inputs-row/inputs-row.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-form",
  standalone: true,
  imports: [FormsModule, NgIf, InputsRowComponent],
  templateUrl: "./form.component.html",
  styleUrl: "./form.component.css"
})
export class FormComponent {
  @Output() getResultsFromFormEventEmitter = new EventEmitter();
  inputRows: InputRow[] = [new InputRow()];
  errors: { [key: string]: number[] } = { x: [], y: [], n: [] };

  addCase() {
    this.inputRows.push(new InputRow());
  }

  deleteRow(index: number) {
    this.inputRows.splice(index, 1);
    // this.validationMessages.splice(index, 1);
  }

  calculate() {
    if (!this.validate()) return;

    let result;

    if (this.inputRows.length === 1) {
      console.log("llamada get");
      result = [{ x: 7, y: 5, n: 12345, resp: 12339 }];
    } else if (this.inputRows.length > 1) {
      console.log("llamada post");
      result = [
        { x: 7, y: 5, n: 12345, resp: 12339 },
        { x: 7, y: 5, n: 12345, resp: 12339 }
      ];
    }

    this.getResultsFromFormEventEmitter.emit(result);
  }

  validate() {
    this.errors = { x: [], y: [], n: [] };
    let isValid = true;

    this.inputRows.forEach((row, index) => {
      if (!row.x || isNaN(row.n) || row.x < 2 || row.x > 1000000000) {
        this.errors["x"].push(index);
        isValid = false;
      }

      if (!row.y || isNaN(row.n) || row.y < 0 || row.y >= row.x) {
        this.errors["y"].push(index);
        isValid = false;
      }

      if (!row.n || isNaN(row.n) || row.n < row.y || row.n > 1000000000) {
        this.errors["n"].push(index);
        isValid = false;
      }
    });

    return isValid;
  }
}
