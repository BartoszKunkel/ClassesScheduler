import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  NgbAlertModule,
  NgbDatepickerModule,
} from "@ng-bootstrap/ng-bootstrap";
import { DataService } from "../../../Services/data.service";

@Component({
  selector: "app-single-datepicker",
  standalone: true,
  imports: [NgbDatepickerModule, NgbAlertModule, CommonModule, FormsModule],
  templateUrl: "./single-datepicker.component.html",
  styleUrl: "./single-datepicker.component.scss",
})
export class SingleDatepickerComponent {
  model: string;

  constructor(private dataService: DataService) {}

  select(date: string) {
    console.log("Sended + " + date);
    this.dataService.dateEmitter.emit(date);
  }
}
