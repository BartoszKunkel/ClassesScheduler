import { Component, OnInit } from "@angular/core";
import { HugeDropdownComponent } from "../../Components/MyComponents/huge-dropdown/huge-dropdown.component";
import { MajorAddFormComponent } from "../../Components/Forms/major-add-form/major-add-form.component";
import { Observable, take, map, Subscription} from "rxjs";
import { Majors } from "../../Data/Majors";
import { MajorsHttpService } from "../../Components/Forms/major-add-form/majors-http.service";
import {
  TableComponent,
  TableConfig,
} from "../../Components/MyComponents/table/table.component";
import { ModalComponent } from "../../Components/MyComponents/modal/modal.component";
import { ModalService } from "../../Components/MyComponents/modal/modal.service";
import { HttpService } from "../../Services/http.service";
import { ToastService } from "../../Components/Bootstrap/toast/toast.service";
import { DropdownService } from "../../Components/MyComponents/dropdown-list/dropdown.service";

@Component({
  selector: "app-view-majors",
  standalone: true,
  imports: [
    HugeDropdownComponent,
    MajorAddFormComponent,
    TableComponent,
    ModalComponent,
  ],
  templateUrl: "./view-majors.component.html",
  styleUrl: "./view-majors.component.scss",
})
export class ViewMajorsComponent implements OnInit {
  public majors$: Observable<Majors[]> = this.majorsHttpService.getMajors$();
  public tableConfig: TableConfig;
  public modalRightButton = { label: "Usuń", action: this.deleteMajor };
  public actionID: any;
  private _subscription = new Subscription();
  private sub: Subscription;
  idToDelete: number;
  constructor(
    private readonly majorsHttpService: MajorsHttpService,
    private readonly modalService: ModalService,
    private readonly httpService: HttpService,
    private readonly toastService: ToastService,
    private readonly dropdownService: DropdownService
  ) {
    this.onView = this.onView.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.deleteMajor = this.deleteMajor.bind(this);
    this.modalRightButton.action = this.deleteMajor.bind(this);
  }

  ngOnInit() {
    this.majorsHttpService.updateMajors$();

    this.tableConfig = {
      caption: "Lista kierunków",
      data$: this.majors$,
      headers: [
        "#",
        "Nazwa",
        "Specjalizacja",
        "Gr. ćwiczeniowa",
        "Gr. Laboratoryjna",
        "Semestr",
        "Tryb",
        "Stopień"
      ],
      actionsColumn: true,
      attributes: [
        "major_id",
        "name",
        "specialization",
        "practice_group",
        "lab_group",
        "study_year",
        "study_mode",
        "lvl_degree"
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
    this.sub = this.majors$.pipe(
      map(data => data[this.actionID]
       ))
      .subscribe(value =>{ 

       const objToSend = {
         major: value,
         trigger: true
       }
     
       const dropDownContentToSend = {
        id: value.major_id,
        content: value.study_year,
        trigger: true
       }
      
       this.dropdownService.emitter.emit(dropDownContentToSend);
       this.majorsHttpService.emitter.emit(objToSend);
     });
     this.sub.unsubscribe();
     this.dropdownService.hugeDropdownToggleEmitter.emit(true);
     window.scrollTo(0,0);
  }

  public onDelete(id: number): void {
    this.modalService.toggleModal("delete_major", true);
  }

  public deleteMajor(): void {
    this._subscription.add(this.majors$.pipe(
      map(data => data[this.actionID]
       ))
      .subscribe(value =>{ 
        this.idToDelete = value.major_id;
     }));

    this._subscription.add(this.httpService
      .deleteMajor(this.idToDelete)
      .pipe(take(1))
      .subscribe(() => {
        this.majorsHttpService.updateMajors$();
        this.modalService.toggleModal("delete_major", false);
        this.toastService.showSuccess("Usunięto kierunek");
      }));
      
  }
}
