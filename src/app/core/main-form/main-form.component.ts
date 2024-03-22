import { Component } from "@angular/core";
import { InputRow } from "../../models/input-row";
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-main-form",
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: "./main-form.component.html",
  styleUrl: "./main-form.component.css"
})
export class MainFormComponent {
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

    if (this.inputRows.length === 1) {
      console.log("llamada get");
    } else if (this.inputRows.length > 1) {
      console.log("llamada post");
    }
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
