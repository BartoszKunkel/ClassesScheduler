import { Component, inject } from "@angular/core";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { JsonPipe } from "@angular/common";
import { DataService } from "../../../Services/data.service";
import { ClassesService } from "../../Reservation/classes-reservation/classes.service";

@Component({
  selector: "app-datepicker",
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe],
  templateUrl: "./datepicker.component.html",
  styleUrl: "./datepicker.component.scss",
})
export class DatepickerComponent {
  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  classesUpdateDate: NgbDateStruct;
  constructor(private dataService: DataService, private classesService: ClassesService) {
    this.classesService.emitter.subscribe(data =>
    {
      const splitST: string[] = (data['classes']['start_time']).split(" ");
      const dateString: string[] = splitST[0].split("-");
      const date: number[] = dateString.map(str => parseInt(str));
      this.classesUpdateDate = {year: date[2], month: date[1], day: date[0]};
      
    })}

  select() {
    if (this.fromDate != null && this.toDate != null) {
      const date = [this.fromDate, this.toDate];
      this.dataService.dateEmitter.emit(date);
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.select();
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
      this.select();
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.select();
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }
}
