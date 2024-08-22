import { Component, Input, Output, NgModule, ViewChild, ElementRef} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataService } from "../../../Services/data.service";
import { Subscription } from 'rxjs';
import { RadioService } from "./radio.service";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-radio",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: "./radio.component.html",
  styleUrl: "./radio.component.scss",
})
export class RadioComponent {
  @Output() isRadio1Checked: boolean;

  @Input() upperRadio = "";
  @Input() lowerRadio = "";
  @Input() emitter: number;

  subscription: Subscription;
  constructor(
    private dataService: DataService,
    ) {}

  radioCheck(i: number) {
    if (this.emitter == 0) {
      if (i == 1) {
        this.isRadio1Checked = true;
        this.dataService.radio1Emitter.emit(this.isRadio1Checked);
      } else {
        this.isRadio1Checked = false;
        this.dataService.radio1Emitter.emit(this.isRadio1Checked);
      }
    } else {
      if (i == 1) {
        this.isRadio1Checked = true;
        this.dataService.radio2Emitter.emit(this.isRadio1Checked);
      } else {
        this.isRadio1Checked = false;
        this.dataService.radio2Emitter.emit(this.isRadio1Checked);
      }
    }
  }
}
