import { Component } from '@angular/core';
import { HugeDropdownComponent } from '../../Components/MyComponents/huge-dropdown/huge-dropdown.component';
import { ModalComponent } from '../../Components/MyComponents/modal/modal.component';
import { TableComponent, TableConfig } from '../../Components/MyComponents/table/table.component';
import { ClassesReservationComponent } from '../../Components/Reservation/classes-reservation/classes-reservation.component';
import { Classes } from '../../Data/Classes';
import { Observable, map, take, Subscription } from "rxjs";
import { ModalService } from '../../Components/MyComponents/modal/modal.service';
import { HttpService } from '../../Services/http.service';
import { ToastService } from '../../Components/Bootstrap/toast/toast.service';
import { DropdownService } from '../../Components/MyComponents/dropdown-list/dropdown.service';
import { MajorsHttpService } from '../../Components/Forms/major-add-form/majors-http.service';
import { Majors } from '../../Data/Majors';
import { ClassesPeriodicReservationComponent } from '../../Components/Reservation/classes-periodic-reservation/classes-periodic-reservation.component';
@Component({
  selector: 'app-view-periodic-classes',
  standalone: true,
  imports: [HugeDropdownComponent,
    ClassesReservationComponent,
    TableComponent,
    ModalComponent,
    ClassesPeriodicReservationComponent
    ],
  templateUrl: './view-periodic-classes.component.html',
  styleUrl: './view-periodic-classes.component.scss'
})
export class ViewPeriodicClassesComponent {
  constructor(
    private readonly majorsHttpService: MajorsHttpService,
    private readonly modalService: ModalService,
    private readonly httpService: HttpService,
    private readonly toastService: ToastService,
    private readonly dropdownService: DropdownService
  ) {
    
  }

  ngOnInit() {
    
  }

}
