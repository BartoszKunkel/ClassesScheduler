import { Component } from '@angular/core';
import { ToastService } from '../../Components/Bootstrap/toast/toast.service';
import { SubjectsHttpService } from '../../Components/Forms/subject-add-form/subjects-http.service';
import { ModalService } from '../../Components/MyComponents/modal/modal.service';
import { TableComponent, TableConfig } from '../../Components/MyComponents/table/table.component';
import { HttpService } from '../../Services/http.service';
import { Observable, take, map, Subscription } from 'rxjs';
import { Subjects } from '../../Data/Subjects';
import { SubjectAddFormComponent } from '../../Components/Forms/subject-add-form/subject-add-form.component';
import { HugeDropdownComponent } from '../../Components/MyComponents/huge-dropdown/huge-dropdown.component';
import { ModalComponent } from '../../Components/MyComponents/modal/modal.component';
import { DropdownService } from '../../Components/MyComponents/dropdown-list/dropdown.service';

@Component({
  selector: 'app-view-subjets',
  standalone: true,
  imports: [
    HugeDropdownComponent,
    SubjectAddFormComponent,
    TableComponent,
    ModalComponent,
          ],
  templateUrl: './view-subjets.component.html',
  styleUrl: './view-subjets.component.scss'
})
export class ViewSubjetsComponent {
  public subjects$: Observable<Subjects[]> = this.subjectsHttpService.getSubjects$();
  public tableConfig: TableConfig;
  public modalRightButton = { label: "Usuń", action: this.deleteSubjects };
  public actionID: any;
  private _subscription = new Subscription();
  private sub: Subscription;
  idToDelete: number;
  constructor(
    private readonly subjectsHttpService: SubjectsHttpService,
    private readonly modalService: ModalService,
    private readonly httpService: HttpService,
    private readonly toastService: ToastService,
    private readonly dropdownService: DropdownService
  ) {
    this.onView = this.onView.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.deleteSubjects = this.deleteSubjects.bind(this);
    this.modalRightButton.action = this.deleteSubjects.bind(this);
  }

  ngOnInit() {
    this.subjectsHttpService.updateSubjects$();

    this.tableConfig = {
      caption: "Lista pokoi",
      data$: this.subjects$,
      headers: [
        "#",
        "Nazwa",
      ],
      actionsColumn: true,
      attributes: [
        "s_id",
        "name",
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
    this.sub = this.subjects$.pipe(
       map(data => data[this.actionID]
        ))
       .subscribe(value =>{ 

        const objToSend = {
          subject: value,
          trigger: true
        }
        
        this.subjectsHttpService.emitter.emit(objToSend);
      });
      this.sub.unsubscribe();
      this.dropdownService.hugeDropdownToggleEmitter.emit(true);
      window.scrollTo(0,0);
  }

  public onDelete(id: number): void {
    this.modalService.toggleModal("delete_subject", true);
  }

  public deleteSubjects(): void {
    this._subscription.add(this.subjects$.pipe(
      map(data => data[this.actionID]
       ))
      .subscribe(value =>{ 
        this.idToDelete = value.s_id;
     }));
     console.log(this.idToDelete);
    this._subscription.add(this.httpService
      .deleteSubject(this.idToDelete)
      .pipe(take(1))
      .subscribe(() => {
        this.subjectsHttpService.updateSubjects$();
        this.modalService.toggleModal("delete_subject", false);
        this.toastService.showSuccess("Usunięto przedmiot");
      }));
    
  }
}
