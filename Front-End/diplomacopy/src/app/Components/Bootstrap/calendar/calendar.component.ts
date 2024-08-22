import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  Subject,
  Subscription,
} from "rxjs";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarModule,
  CalendarView,
} from "angular-calendar";
import { EventColor } from "calendar-utils";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FlatpickrModule } from "angularx-flatpickr";
import { DataService } from "../../../Services/data.service";
import { Rooms } from "../../../Data/Rooms";
import { Subjects } from "../../../Data/Subjects";
import { Teachers } from "../../../Data/Teachers";
import { ClassesEntity } from "../../../Data/ClassesEntity";
import { endOfDay, isSameDay, isSameMonth, startOfDay } from "date-fns";
import { ClassesService } from "../../Reservation/classes-reservation/classes.service";

const colors: Record<string, EventColor> = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3",
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA",
  },
};

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    CalendarModule,
    FlatpickrModule,
  ],
  templateUrl: "./calendar.component.html",
  styleUrl: "./calendar.component.scss",
})
export class CalendarComponent implements OnInit, OnDestroy {
  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  classesTable: ClassesEntity[] = [];
  classesInstance = new ClassesEntity();
  roomsInstance = new Rooms();
  teachersInstance = new Teachers();
  subjectsInstance = new Subjects();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  refresh = new Subject<void>();
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: "Edit",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent("Edited", event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: "Delete",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent("Deleted", event);
      },
    },
  ];
  events: CalendarEvent[] = [
    // {
    //   start: new Date("2024-04-19T09:00:00"),
    //   end: new Date("2024-04-19T19:00:00"),
    //   title: "A 3 day event",
    //   color: { ...colors["red"] },
    //   actions: this.actions,
    //   allDay: false,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: false,
    // },
    // {
    //   start: new Date(),
    //   end: new Date(new Date().getTime() + 3600000),
    //   title: "A 3 day event \n asdas \n asda \n",
    //   color: { ...colors["red"] },
    //   actions: this.actions,
    //   allDay: false,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: false,
    // },
    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   color: { ...colors["yellow"] },
    //   actions: this.actions,
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: { ...colors["blue"] },
    //   allDay: true,
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: addHours(new Date(), 2),
    //   title: 'A draggable and resizable event',
    //   color: { ...colors["yellow"] },
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
  ];
  activeDayIsOpen: boolean = true;
  private _subscriptions = new Subscription();

  constructor(
    private modal: NgbModal,
    private dataService: DataService,
   
  ) {
    this._subscriptions.add(
      this.dataService.classesDataEmitter.subscribe((data) => {
        this.classesTable = data;
        console.log(data);
        console.log(this.classesTable);
        if (this.classesInstance != undefined) {
          this.setEvents();
        }
      }),
    );
    
  }

  ngOnInit() {
    if (window.innerWidth <= 768) {
      this.view = CalendarView.Day;
    } else {
      this.view = CalendarView.Week;
    }

    this._subscriptions.add(
      fromEvent(window, "resize")
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(() => {
          const size = window.innerWidth;

          switch (true) {
            case size <= 768:
              this.view = CalendarView.Day;
              break;
            default:
              this.view = CalendarView.Week;
              break;
          }
        }),
    );
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !(
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      );
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: "lg" });
  }

  setEvents() {
    let i = 0;
    let switchColor = { ...colors["blue"] };
    this.events = [];
    for (let c of this.classesTable) {
      let s: string =
        `${c.subject.name}` +
        `\n` +
        `${this.teachersInstance.toString(c.teacher)}` +
        "\n" +
        `${this.roomsInstance.toString(c.room)}`;

      let start_time: string = c["start_time"];
      let end_time: string = c["end_time"];
      start_time = start_time.replace(" ", "T");
      end_time = end_time.replace(" ", "T");
      if (i % 2 == 0) {
        switchColor = { ...colors["blue"] };
      } else {
        switchColor = { ...colors["yellow"] };
      }
      i++;
      const newEventv2: CalendarEvent = {
        start: new Date(start_time),
        end: new Date(end_time),
        title: s,
        color: switchColor,
     
        allDay: false,
      };
      console.log(newEventv2);
      this.events = [...this.events, newEventv2];
    }
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: "New event",
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors["red"],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
