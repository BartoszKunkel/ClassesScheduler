import { Component } from '@angular/core';
import { RoomsAddFormComponent } from '../../Components/Forms/rooms-add-form/rooms-add-form.component';
import { HugeDropdownComponent } from '../../Components/MyComponents/huge-dropdown/huge-dropdown.component';
import { ModalComponent } from '../../Components/MyComponents/modal/modal.component';
import { TableComponent, TableConfig } from '../../Components/MyComponents/table/table.component';
import { Rooms } from '../../Data/Rooms';
import { Observable, take, map, Subscription} from 'rxjs';
import { RoomsHttpService } from '../../Components/Forms/rooms-add-form/rooms-http.service';
import { ModalService } from '../../Components/MyComponents/modal/modal.service';
import { HttpService } from '../../Services/http.service';
import { ToastService } from '../../Components/Bootstrap/toast/toast.service';
import { DropdownService } from '../../Components/MyComponents/dropdown-list/dropdown.service';
@Component({
  selector: 'app-view-rooms',
  standalone: true,
  imports: [HugeDropdownComponent,
            RoomsAddFormComponent,
            TableComponent,
            ModalComponent,],
  templateUrl: './view-rooms.component.html',
  styleUrl: './view-rooms.component.scss'
})
export class ViewRoomsComponent {
  public rooms$: Observable<Rooms[]> = this.roomsHttpService.getRooms$();
  public tableConfig: TableConfig;
  public modalRightButton = { label: "Usuń", action: this.deleteRoom };
  public actionID: any;
  private _subscription = new Subscription();
  private sub: Subscription;
  idToDelete: number;
  constructor(
    private readonly roomsHttpService: RoomsHttpService,
    private readonly modalService: ModalService,
    private readonly httpService: HttpService,
    private readonly toastService: ToastService,
    private readonly dropdownService: DropdownService
  ) {
    this.onView = this.onView.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
    this.modalRightButton.action = this.deleteRoom.bind(this);
  }

  ngOnInit() {
    this.roomsHttpService.updateRooms$();

    this.tableConfig = {
      caption: "Lista pokoi",
      data$: this.rooms$,
      headers: [
        "#",
        "Budynek",
        "Numer",
        "Sufiks",
      ],
      actionsColumn: true,
      attributes: [
        "r_id",
        "building",
        "numer",
        "suffix",
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
    this.sub = this.rooms$.pipe(
      map(data => data[this.actionID]
       ))
      .subscribe(value =>{ 

       const objToSend = {
         room: value,
         trigger: true
       }
       this.roomsHttpService.emitter.emit(objToSend);
     });
     this.sub.unsubscribe();
     this.dropdownService.hugeDropdownToggleEmitter.emit(true);
     window.scrollTo(0,0);
  }

  public onDelete(id: number): void {
    this.modalService.toggleModal("delete_room", true);
  }

  public deleteRoom(): void {
    this._subscription.add(this.rooms$.pipe(
      map(data => data[this.actionID]
       ))
      .subscribe(value =>{ 
        this.idToDelete = value.r_id;
     }));

    this._subscription.add(this.httpService
      .deleteRoom(this.idToDelete)
      .pipe(take(1))
      .subscribe(() => {
        this.roomsHttpService.updateRooms$();
        this.modalService.toggleModal("delete_room", false);
        this.toastService.showSuccess("Usunięto pokoj");
      }));
  }
}
