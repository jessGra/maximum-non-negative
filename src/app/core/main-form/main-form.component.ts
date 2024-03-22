import { Component } from "@angular/core";
import { InputRow } from "../../models/input-row";
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { ResultsComponent } from "./components/results/results.component";
import { CalculationResult } from "../../interfaces/calculation-result";

@Component({
  selector: "app-main-form",
  standalone: true,
  imports: [FormsModule, NgIf, ResultsComponent],
  templateUrl: "./main-form.component.html",
  styleUrl: "./main-form.component.css"
})
export class MainFormComponent {
  inputRows: InputRow[] = [new InputRow()];
  errors: { [key: string]: number[] } = { x: [], y: [], n: [] };
  results: CalculationResult[] = [];

  addCase() {
    this.inputRows.push(new InputRow());
  }

  deleteRow(index: number) {
    this.inputRows.splice(index, 1);
    // this.validationMessages.splice(index, 1);
  }

  newCalculation() {
    this.inputRows = [new InputRow()];
    this.errors = { x: [], y: [], n: [] };
    this.results = [];
  }

  calculate() {
    if (!this.validate()) return;

    if (this.inputRows.length === 1) {
      console.log("llamada get");
      this.results = [{ x: 7, y: 5, n: 12345, resp: 12339 }];
    } else if (this.inputRows.length > 1) {
      console.log("llamada post");
      this.results = [
        { x: 7, y: 5, n: 12345, resp: 12339 },
        { x: 7, y: 5, n: 12345, resp: 12339 }
      ];
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
