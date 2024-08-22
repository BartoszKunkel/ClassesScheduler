import { Component, OnInit, ViewChild, inject} from "@angular/core";
import { Subscription } from "rxjs";
import { Data } from "../../../Data/Data";
import { Majors } from "../../../Data/Majors";
import { DataService } from "../../../Services/data.service";
import { HttpService } from "../../../Services/http.service";
import { RadioComponent } from "../../Bootstrap/radio/radio.component";
import { DropDownListComponent } from "../../MyComponents/dropdown-list/dropdown-list.component";
import { NgClass, NgIf } from "@angular/common";
import { ModalComponent } from "../../MyComponents/modal/modal.component";
import { ModalService } from "../../MyComponents/modal/modal.service";
import { AlertComponent } from "../../Bootstrap/alert/alert.component";
import { ClassesReservationComponent } from "../../Reservation/classes-reservation/classes-reservation.component";
import { ClassesPeriodicReservationComponent } from "../../Reservation/classes-periodic-reservation/classes-periodic-reservation.component";
import { ClassesEntity } from "../../../Data/ClassesEntity";
import { HugeDropdownComponent } from "../../MyComponents/huge-dropdown/huge-dropdown.component";
import { LoadingService } from "../../../Services/loading.service";

@Component({
  selector: "app-searchbar",
  standalone: true,
  imports: [
    DropDownListComponent,
    RadioComponent,
    NgIf,
    NgClass,
    ModalComponent,
    AlertComponent,
    ClassesReservationComponent,
    ClassesPeriodicReservationComponent,
    HugeDropdownComponent,
  ],
  templateUrl: "./searchbar.component.html",
  styleUrl: "./searchbar.component.scss",
})
export class SearchbarComponent implements OnInit {
  @ViewChild("alertRef") alertRef: AlertComponent;
  loadingService = inject(LoadingService);
  subscription: Subscription;
  classesSubscription: Subscription;

  majorsInstance = new Majors();
  major_table: Majors[];
  huge_table: Majors[][] = [];
  classesTable: ClassesEntity[];
  classesEntityInstance = new ClassesEntity();
  study_mode_table: Data[] = [
    { id: 1, content: "Stacjonarne" },
    { id: 2, content: "Niestacjonarne" },
  ];
  lvl_degree_table: Data[] = [
    { id: 1, content: "Pierwszego Stopnia" },
    { id: 2, content: "Drugiego Stopnia" },
  ];
  name_table: Data[] = [];
  specialization_table: Data[] = [];
  study_year_table: Data[] = [];
  practice_group_table: Data[] = [];
  lab_group_table: Data[] = [];

  study_mode;
  lvl_degree;
  name;
  specialization;
  study_year;
  practice_group;
  lab_group;
  selector: number = -1;

  cl: boolean[] = [false, false, false, false, false, false, false];

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit() {
    this.subscription = this.httpService.getMajors().subscribe((data) => {
      this.major_table = this.majorsInstance.convertFromJSON(
        JSON.parse(JSON.stringify(data)),
      );
      this.huge_table.push(this.major_table);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.classesSubscription && this.classesSubscription.unsubscribe();
  }

  setData(data: number, choose: number) {
    switch (choose) {
      case -1:
        this.study_mode = data;
        this.sortData("study_mode", null, this.study_mode, 1);
        break;
      case 0:
        this.lvl_degree = data;
        this.sortData("lvl_degree", null, this.lvl_degree, 2);
        break;
      case 1:
        this.name = data;
        this.sortData("name", this.name, null, 3);
        break;
      case 2:
        this.specialization = data;
        this.sortData("specialization", this.specialization, null, 4);
        break;
      case 3:
        this.study_year = data;
        this.sortData("study_year", this.study_year, null, 5);
        break;
      case 4:
        this.practice_group = data;
        this.sortData("practice_group", this.practice_group, null, 6);
        break;

      case 5:
        this.lab_group = data;
        this.sortData("lab_group", this.lab_group, null, 7);
        break;
    }
  }

  linearSearch(
    table: Majors[],
    target: string,
    numberTarget: number,
    indicator: string,
  ): Majors[] {
    let tableA: Majors[] = [];

    if (target != null) {
      for (let i = 0; i < table.length; i++) {
        if (table[i][`${indicator}`] == target) {
          tableA.push(table[i]);
        }
      }
    } else {
      for (let i = 0; i < table.length; i++) {
        if (table[i][`${indicator}`] == numberTarget) {
          tableA.push(table[i]);
        }
      }
    }
    return tableA;
  }

  sortData(
    indicator: string,
    target: string,
    numberTarget: number,
    chooseNumber: number,
  ) {
    if (this.huge_table[chooseNumber] === undefined) {
      let newList: Majors[];

    

      newList = this.linearSearch(
        this.huge_table[chooseNumber - 1],
        target,
        numberTarget,
        indicator,
      );
      this.major_table = newList;
      this.huge_table.push(newList);
      this.showData(chooseNumber);
    } else {
      for (let i = this.huge_table.length; i > chooseNumber; i--) {
        this.huge_table.pop();
        this.cleanData(i);
        if (i - 1 == chooseNumber) {
          this.cleanData(chooseNumber);
    
        }
      }
      this.sortData(indicator, target, numberTarget, chooseNumber);
    }
  }

  showData(chosed: number) {
    setTimeout(() => {
      if (chosed == 1) {
        this.cl[chosed] = false;
      }
      if (chosed == 2) {
        this.name_table = this.majorsInstance.convertToData(
          this.huge_table[2],
          "name",
          true,
        );
        this.cl[chosed] = false;
      }
      if (chosed == 3) {
        this.specialization_table = this.majorsInstance.convertToData(
          this.huge_table[3],
          "specialization",
          true,
        );
        this.cl[chosed] = false;
      }
      if (chosed == 4) {
        this.study_year_table = this.majorsInstance.convertToData(
          this.huge_table[4],
          "study_year",
          true,
        );
        this.cl[chosed] = false;
      }
      if (chosed == 5) {
        this.practice_group_table = this.majorsInstance.convertToData(
          this.huge_table[5],
          "practice_group",
          true,
        );
        this.cl[chosed] = false;
      }
      if (chosed == 6) {
        this.lab_group_table = this.majorsInstance.convertToData(
          this.huge_table[5],
          "lab_group",
          true,
        );
        this.cl[chosed] = false;
      }
    }, 50);
  }

  cleanData(chosed: number) {
    if (chosed == 1) {
      this.lvl_degree = null;
      this.cl[1] = true;
    }
    if (chosed == 2) {
      this.name_table = [];
      this.name = null;
      
      this.cl[2] = true;
     
    }
    if (chosed == 3) {
      this.specialization_table = [];
      this.specialization = null;

      this.cl[3] = true;
    }
    if (chosed == 4) {
      this.study_year_table = [];
      this.study_year = null;
      this.cl[4] = true;
    }
    if (chosed == 5) {
      this.practice_group_table = [];
      this.practice_group = null;
      this.cl[5] = true;
    }
    if (chosed == 6) {
      this.lab_group_table = [];
      this.lab_group = null;
      this.cl[6] = true;
    }
  }

  find() {
    
    if (this.huge_table[6] !== undefined) {
      const major: Majors[] = this.huge_table[6];
      const sendId = major[0]["major_id"];
      this.classesSubscription = this.httpService
        .getSortedClasses(sendId)
        .subscribe((data) => {
          this.classesTable = this.classesEntityInstance.convertFromJSON(
            JSON.parse(JSON.stringify(data)),
          );
          setTimeout(() => {
            this.loadingService.toggleIsLoading(false);
          }, 700);
                if(this.classesTable !== undefined){
        this.dataService.classesDataEmitter.emit(this.classesTable);
      }else{
        this.alertRef.changeErrorMessage(
        `Bład, nie istnieją zajęcia związane z tym kierunkiem`,
        );
      }
        });
        

    } else {
      // this.isOpen = true;
      this.alertRef.changeWarningMessage(
        `Aby wyszukać musisz wybrać wszystie filtry`,
      );
    }
  }

  public openModal(): void {
    this.modalService.toggleModal("test", true);
  }

  // getData()
  // {
  //   if(this.lvl_degree != undefined){
  //     this.majorsInstance.lvl_degree = this.lvl_degree;
  //     if(this.name_table == undefined){
  //     this.httpService.filterMajors(this.majorsInstance, this.selector).subscribe(data => {
  //       this.name_table = this.majorsInstance.convertToData(
  //         this.majorsInstance.convertFromJSON(
  //           JSON.parse(
  //             JSON.stringify(data))), "name");

  //     })
  //   }
  //     if(this.name != undefined){
  //       this.majorsInstance.name = this.name;
  //       if(this.specialization_table == undefined){
  //       this.httpService.filterMajors(this.majorsInstance, this.selector).subscribe(data => {

  //         this.specialization_table = this.majorsInstance.convertToData(
  //           this.majorsInstance.convertFromJSON(
  //             JSON.parse(
  //               JSON.stringify(data))), "specialization");

  //       })
  //     }
  //       if(this.specialization != undefined){
  //         const foundSpecialization = this.specialization_table.find(obj => obj.id === this.specialization);
  //         const content = foundSpecialization.content;
  //         this.majorsInstance.specialization = content;
  //         this.httpService.filterMajors(this.majorsInstance, this.selector).subscribe(data => {
  //           console.log(this.majorsInstance);
  //           console.log(data);
  //           this.study_year_table = this.majorsInstance.convertToData(
  //             this.majorsInstance.convertFromJSON(
  //               JSON.parse(
  //                 JSON.stringify(data))), "study_year");
  //                 console.log(this.study_year_table);
  //         })
  //         if(this.study_year != undefined && this.selector == 0){
  //           this.majorsInstance.study_year = this.study_year;
  //           this.httpService.filterMajors(this.majorsInstance, this.selector).subscribe(data => {
  //             this.group_table = this.majorsInstance.convertToData(
  //               this.majorsInstance.convertFromJSON(
  //                 JSON.parse(
  //                   JSON.stringify(data))), "practice_group");
  //           })
  //           }else if(this.study_year != undefined && this.selector == 1){
  //             this.majorsInstance.practice_group = this.group;
  //             this.httpService.filterMajors(this.majorsInstance, this.selector).subscribe(data => {
  //               this.group_table = this.majorsInstance.convertToData(
  //                 this.majorsInstance.convertFromJSON(
  //                   JSON.parse(
  //                     JSON.stringify(data))), "lab_group");
  //             })
  //           }
  //         }
  //       }
  //     }
  //   }
}
