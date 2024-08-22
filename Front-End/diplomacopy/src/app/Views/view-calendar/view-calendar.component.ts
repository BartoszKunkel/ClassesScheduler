import { Component } from "@angular/core";
import { CalendarDisplayComponent } from "../../Components/MyComponents/calendar-display/calendar-display.component";
import { TeacherAddFormComponent } from "../../Components/Forms/teacher-add-form/teacher-add-form.component";
import { RoomsAddFormComponent } from "../../Components/Forms/rooms-add-form/rooms-add-form.component";
import { SubjectAddFormComponent } from "../../Components/Forms/subject-add-form/subject-add-form.component";
import { ClassesReservationComponent } from "../../Components/Reservation/classes-reservation/classes-reservation.component";

@Component({
  selector: "app-view-calendar",
  standalone: true,
  imports: [
    CalendarDisplayComponent,
    TeacherAddFormComponent,
    RoomsAddFormComponent,
    SubjectAddFormComponent,
    ClassesReservationComponent,
  ],
  templateUrl: "./view-calendar.component.html",
  styleUrl: "./view-calendar.component.scss",
})
export class ViewCalendarComponent {}
