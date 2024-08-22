import { Component } from '@angular/core';
import { TeacherAddFormComponent } from '../../Components/Forms/teacher-add-form/teacher-add-form.component';
import { HugeDropdownComponent } from '../../Components/MyComponents/huge-dropdown/huge-dropdown.component';
import { ModalComponent } from '../../Components/MyComponents/modal/modal.component';
import { TableComponent, TableConfig } from '../../Components/MyComponents/table/table.component';
import { Observable, take , map, Subscription } from 'rxjs';
import { Teachers } from '../../Data/Teachers';
import { TeacherHttpService } from '../../Components/Forms/teacher-add-form/teacher-http.service';
import { ModalService } from '../../Components/MyComponents/modal/modal.service';
import { HttpService } from '../../Services/http.service';
import { ToastService } from '../../Components/Bootstrap/toast/toast.service';
import { DropdownService } from '../../Components/MyComponents/dropdown-list/dropdown.service';

@Component({
  selector: 'app-view-teachers',
  standalone: true,
  imports: [
    HugeDropdownComponent,
    TeacherAddFormComponent,
    TableComponent,
    ModalComponent,
  ],
  templateUrl: './view-teachers.component.html',
  styleUrl: './view-teachers.component.scss'
})
export class ViewTeachersComponent {
  public teachers$: Observable<Teachers[]> = this.teachersHttpService.getTeacher$();
  public tableConfig: TableConfig;
  public modalRightButton = { label: "Usuń", action: this.deleteTeachers };
  public actionID: any;
  private _subscription = new Subscription();
  private sub: Subscription;
  private edit: boolean = false;
  idToDelete: number;
  
  constructor(
    private readonly teachersHttpService: TeacherHttpService,
    private readonly modalService: ModalService,
    private readonly httpService: HttpService,
    private readonly toastService: ToastService,
    private readonly dropDownService: DropdownService,
  ) {
    this.onView = this.onView.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.deleteTeachers = this.deleteTeachers.bind(this);
    this.modalRightButton.action = this.deleteTeachers.bind(this);
  }

  ngOnInit() {
    this.teachersHttpService.updateTeachers$();

    this.tableConfig = {
      caption: "Lista prowadzących",
      data$: this.teachers$,
      headers: [
        "#",
        "Imię",
        "Nazwisko",
        "Stopień naukowy"
      ],
      actionsColumn: true,
      attributes: [
        "t_id",
        "name",
        "surname",
        "a_degree"
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
    console.log("view " + id);
  }

  public onEdit(id: number): void {

    this.sub = this.teachers$.pipe(
      map(data => data[this.actionID]
       ))
      .subscribe(value =>{ 

       const objToSend = {
         teacher: value,
         trigger: true
       }
       const dropDownContentToSend = {
        id: value.t_id,
        content: value.a_degree,
        trigger: true
       }
       this.teachersHttpService.emitter.emit(objToSend);
       this.dropDownService.emitter.emit(dropDownContentToSend);
       objToSend.trigger = false;
       this.teachersHttpService.emitter.emit(false);
     });
     const objToSend = {
      trigger: false
    
    }
     this.teachersHttpService.emitter.emit(objToSend);
     this.sub.unsubscribe();
     this.dropDownService.hugeDropdownToggleEmitter.emit(true);
     window.scrollTo(0,0);
  }

  public onDelete(id: number): void {
    this.modalService.toggleModal("delete_teacher", true);
  }

  public deleteTeachers(): void {
    this._subscription.add(this.teachers$.pipe(
      map(data => data[this.actionID]
       ))
      .subscribe(value =>{ 
        this.idToDelete = value.t_id;
     }));
    this._subscription.add(this.httpService
      .deleteTeacher(this.idToDelete)
      .pipe(take(1))
      .subscribe(() => {
        this.teachersHttpService.updateTeachers$();
        this.modalService.toggleModal("delete_teacher", false);
        this.toastService.showSuccess("Usunięto prowadzącego");
      }));
  }
}
