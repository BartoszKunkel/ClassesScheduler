import { Component } from '@angular/core';
import { endOfMonth, subDays } from 'date-fns';
import { CalendarComponent } from '../../Bootstrap/calendar/calendar.component';
import { SearchbarComponent } from '../../Searching/searchbar/searchbar.component';

@Component({
  selector: 'app-calendar-display',
  standalone: true,
  imports: [SearchbarComponent, CalendarComponent],
  templateUrl: './calendar-display.component.html',
  styleUrl: './calendar-display.component.scss'
})
export class CalendarDisplayComponent {
ngOnInit(){
}
}
