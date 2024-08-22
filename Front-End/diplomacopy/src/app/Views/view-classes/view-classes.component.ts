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
import { ClassesService } from '../../Components/Reservation/classes-reservation/classes.service';
import { ClassesEntity } from '../../Data/ClassesEntity';

@Component({
  selector: 'app-view-classes',
  standalone: true,
  imports: [
    HugeDropdownComponent,
    ClassesReservationComponent,
    TableComponent,
    ModalComponent,
  ],
  templateUrl: './view-classes.component.html',
  styleUrl: './view-classes.component.scss'
})
export class ViewClassesComponent {
  public classes$: Observable<ClassesEntity[]> = this.classesHttpService.getClasses$();
  public tableConfig: TableConfig;
  public modalRightButton = { label: "Usuń", action: this.deleteClasses };
  public actionID: any;
  private _subscription = new Subscription();
  private sub: Subscription;
  idToDelete: number;
  constructor(
    private readonly classesHttpService: ClassesService,
    private readonly modalService: ModalService,
    private readonly httpService: HttpService,
    private readonly toastService: ToastService,
    private readonly dropdownService: DropdownService
  ) {
    this.onView = this.onView.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.deleteClasses = this.deleteClasses.bind(this);
    this.modalRightButton.action = this.deleteClasses.bind(this);
  }

  ngOnInit() {
    this.classesHttpService.updateClasses$();

    this.tableConfig = {
      caption: "Lista zajęć",
      data$: this.classes$,
      headers: [
        "#",
        "Data rozpoczęcia",
        "Data zakończenia",
        "Kierunek",
        "Sala",
        "Prowadzący",
        "Przedmiot"
      ],
      actionsColumn: true,
      attributes: [
        "c_id",
        "start_time",
        "end_time",
        "majorName",
        "fullRoom",
        "fullTeacher",
        "subjectName"
      ],
      onView: this.onView,
      onEdit: this.onEdit,
      onDelete: this.onDelete,
    };
  }

ngOnDestroy(){
  this._subscription.unsubscribe();
}

  public onView(id: number): void {
    this.sub = this.classes$.pipe(
      map(data => data[this.actionID]
       ))
      .subscribe(value =>{ 
        console.log(value); 
     });
     this.sub.unsubscribe();
  }

  public onEdit(id: number): void {
    this.sub = this.classes$.pipe(
      map(data => data[this.actionID]
       ))
      .subscribe(value =>{ 

       const objToSend = {
         classes: value,
         trigger: true
       }
     
      
       this.classesHttpService.emitter.emit(objToSend);
     });
     this.sub.unsubscribe();
     this.dropdownService.hugeDropdownToggleEmitter.emit(true);
     window.scrollTo(0,0);
  }

  public onDelete(id: number): void {
    this.modalService.toggleModal("delete_classes", true);
  }

  public deleteClasses(): void {
    this._subscription.add(this.classes$.pipe(
      map(data => data[this.actionID]
       ))
      .subscribe(value =>{ 
        this.idToDelete = value.c_id;
     }));

    this._subscription.add(this.httpService
      .deleteClasses(this.idToDelete)
      .pipe(take(1))
      .subscribe(() => {
        this.classesHttpService.updateClasses$();
        this.modalService.toggleModal("delete_classes", false);
        this.toastService.showSuccess("Usunięto kierunek");
      }));
  }
}
