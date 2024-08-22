import { Component } from '@angular/core';
import { RegistrationFormComponent } from '../../Components/Forms/registration-form/registration-form.component';
import { HugeDropdownComponent } from '../../Components/MyComponents/huge-dropdown/huge-dropdown.component';
import { ModalComponent } from '../../Components/MyComponents/modal/modal.component';
import { TableComponent, TableConfig } from '../../Components/MyComponents/table/table.component';
import { map, take, Subscription, Observable } from "rxjs";
import { Registration } from '../../Data/Registration';
import { RegistrationService } from '../../Components/Forms/registration-form/registration.service';
import { ModalService } from '../../Components/MyComponents/modal/modal.service';
import { HttpService } from '../../Services/http.service';
import { DropdownService } from '../../Components/MyComponents/dropdown-list/dropdown.service';
import { ToastService } from '../../Components/Bootstrap/toast/toast.service';
@Component({
  selector: 'app-view-register',
  standalone: true,
  imports: [
    HugeDropdownComponent,
    RegistrationFormComponent,
    TableComponent,
    ModalComponent,
  ],
  templateUrl: './view-register.component.html',
  styleUrl: './view-register.component.scss'
})
export class ViewRegisterComponent {
  public register$: Observable<Registration[]> = this.registrationHttpService.getRegistration$();
  public tableConfig: TableConfig;
  public modalRightButton = { label: "Usuń", action: this.deleteUser };
  public actionID: any;
  private _subscription = new Subscription();
  private sub: Subscription;
  idToDelete: number;
  
  constructor(
    private readonly registrationHttpService: RegistrationService,
    private readonly modalService: ModalService,
    private readonly httpService: HttpService,
    private readonly toastService: ToastService,
    private readonly dropDownService: DropdownService,
  ) {
    this.onView = this.onView.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.modalRightButton.action = this.deleteUser.bind(this);
  }

  ngOnInit() {
    this.registrationHttpService.updateRegistration$();

    this.tableConfig = {
      caption: "Lista użytkowników",
      data$: this.register$,
      headers: [
        "#",
        "Login",
        "Imię",
        "Nazwisko",
        "Poziom dostępu"
      ],
      actionsColumn: true,
      attributes: [
        "id",
        "login",
        "firstName",
        "lastName",
        "accesslvl"
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
    this.sub = this.register$.pipe(
      map(data => data[this.actionID]
       ))
      .subscribe(value =>{ 

       const objToSend = {
         teacher: value,
         trigger: true
       }
       const dropDownContentToSend = {
        id: value.id,
        content: value.accesslvl,
        trigger: true
       }
       this.registrationHttpService.emitter.emit(objToSend);
       this.dropDownService.emitter.emit(dropDownContentToSend);
     });
     this.dropDownService.hugeDropdownToggleEmitter.emit(true);
     this.sub.unsubscribe();
     window.scrollTo(0,0);
  }

  public onDelete(id: number): void {
    this.modalService.toggleModal("delete_user", true);
  }

  public deleteUser(): void {
    this._subscription.add(this.register$.pipe(
      map(data => data[this.actionID]
       ))
      .subscribe(value =>{ 
        this.idToDelete = value.id;
        
     }));
    this._subscription.add(this.httpService
      .deleteUser(this.idToDelete)
      .pipe(take(1))
      .subscribe(() => {
        this.registrationHttpService.updateRegistration$();
        this.modalService.toggleModal("delete_user", false);
        this.toastService.showSuccess("Usunięto użytkownika");
      }));
     
    }
}
