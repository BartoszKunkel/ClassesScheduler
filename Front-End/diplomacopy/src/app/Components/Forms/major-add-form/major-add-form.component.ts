import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Data } from "../../../Data/Data";
import { DataService } from "../../../Services/data.service";
import { HttpService } from "../../../Services/http.service";
import { AlertComponent } from "../../Bootstrap/alert/alert.component";
import { RadioComponent } from "../../Bootstrap/radio/radio.component";
import { DropDownListComponent } from "../../MyComponents/dropdown-list/dropdown-list.component";
import { Subscription } from "rxjs";
import { MajorsHttpService } from "./majors-http.service";
import { CustomValidators } from "../CustomValidators";
import { DropdownService } from "../../MyComponents/dropdown-list/dropdown.service";
import { RadioService } from "../../Bootstrap/radio/radio.service";
import { Majors } from "../../../Data/Majors";

@Component({
  selector: "app-major-add-form",
  standalone: true,
  imports: [
    RadioComponent,
    DropDownListComponent,
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
  ],
  templateUrl: "./major-add-form.component.html",
  styleUrl: "./major-add-form.component.scss",
})
export class MajorAddFormComponent implements OnInit, OnDestroy {
  @ViewChild("alertRef") alertRef: AlertComponent;
  majorsForm: FormGroup;

  radioStudy_mode: string[] = ["Stacjonarne", "Niestacjonarne"];
  radioLvl_degree: string[] = ["Pierwszego stopnia", "Drugiego Stopnia"];
  studyModeToSend: boolean = true;
  lvlDegreeToSend: boolean = true;

  id: number = null;
  update: boolean = false;

  semester_table: Data[] = [
    { id: 0, content: "I" },
    { id: 1, content: "II" },
    { id: 2, content: "III" },
    { id: 3, content: "IV" },
    { id: 4, content: "V" },
    { id: 5, content: "VI" },
    { id: 6, content: "VII" },
  ];

  private _subscription = new Subscription();

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private majorsHttpService: MajorsHttpService,
    private dropdownService: DropdownService,
    private radioService: RadioService,
  ) {
    this._subscription.add(
      this.dataService.radio1Emitter.subscribe((data) => {
        this.studyModeToSend = data;
        console.log(data)
      }),
    );

    this._subscription.add(
      this.dataService.radio2Emitter.subscribe((data) => {
        this.lvlDegreeToSend = data;
        console.log(data)
      }),
    );
    this._subscription.add(
      this.majorsHttpService.emitter.subscribe(response =>
        {
          if(response['trigger'] == true){
            this.updateMajor(response['major']);  
            response['trigger'] = false ;
          }
        })
    )

  }

  ngOnInit(): void {
    this.majorsForm = new FormGroup({
      name: new FormControl<string>("", [
        Validators.required,
        Validators.compose(
          [
          CustomValidators.polishAlphabet,
          CustomValidators.onlySpaceAndHyphen
          ]
        ),
        Validators.maxLength(254),
      ]),
      specialization: new FormControl<string>("", [
        Validators.required,
        Validators.compose(
          [
          CustomValidators.polishAlphabet,
          CustomValidators.onlySpaceAndHyphen
          ]
        ),
        Validators.maxLength(254),
      ]),
      lab_group: new FormControl<string>("", [
        Validators.required,
        Validators.compose(
          [
          CustomValidators.polishAlphabet,
          CustomValidators.onlySpaceAndHyphen
          ]
        ),
        Validators.maxLength(254),
      ]),
      practice_group: new FormControl<string>("", [
        Validators.required,
        Validators.compose(
          [
          CustomValidators.polishAlphabet,
          CustomValidators.onlySpaceAndHyphen
          ]
        ),
        Validators.maxLength(254),
      ]),
      lvl_degree: new FormControl<boolean>(false),
      study_mode: new FormControl<boolean>(false),
      semester: new FormControl<string>("", [Validators.required]),
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  updateMajor(received: Majors): void {
    this.majorsForm.reset();
    this.majorsForm.patchValue({
      name: received.name,
      specialization: received.specialization,
      lab_group: received.lab_group,
      practice_group: received.practice_group,
      lvl_degree: received.lvl_degree,
      study_mode: received.study_mode,
      semester: received.study_year,
    })
    this.id = received.major_id;
    this.update = true;
  }

  submit(): void {
    const formData = this.majorsForm.value;
    const studyMode = this.studyModeToSend ? 1 : 2;
    const lvlDegree = this.lvlDegreeToSend ? 1 : 2;

    const dataToSend = {
      name: this.majorsForm.get('name').value,
      specialization: this.majorsForm.get('specialization').value,
      practice_group: this.majorsForm.get('practice_group').value,
      lab_group: this.majorsForm.get('lab_group').value,
      study_mode: studyMode,
      lvl_degree: lvlDegree,
      study_year: this.majorsForm.get('semester').value
      }
     
      if(!this.update){
    if (this.majorsForm.valid) {
      this._subscription.add(
        this.httpService
          .postMajor(dataToSend)
          .subscribe({
            next: () => {
              this.alertRef.changeSuccessMessage(
                `Dodano rekord do bazy danych.`,
              );
              this.majorsHttpService.updateMajors$();
              this.majorsForm.reset();
              this.dropdownService.clearEmmiter.emit(true);

            },
            error: (error: any) => {
              this.alertRef.changeErrorMessage(
                "Coś poszło nie tak. Oto błąd zostanie przedstawiony w następnym alercie.",
              );
              const errorMessage = JSON.stringify(error);
              this.alertRef.changeStaticErrorMessage(errorMessage);
            },
          }),
      );
    } else {
      this.alertRef.changeWarningMessage(
        `Wszystkie pola muszą być poprawnie wypełnione. Najedź kursorem na dane pole wpisywania, aby dowiedzieć się więcej.`,
      );
    }}else{
      if(this.majorsForm.valid){
        this._subscription.add(this.httpService.partialUpdateMajor(dataToSend, this.id)
        .subscribe({
          next:() => {
            this.alertRef.changeSuccessMessage(
              `Edytowano rekord.`
              );
              this.majorsHttpService.updateMajors$();
              this.dropdownService.clearEmmiter.emit(true);
              this.majorsForm.reset();
              this.update = false;  
          },
          error:(error: any) => {
            this.alertRef.changeErrorMessage(
              'Coś poszło nie tak. Oto błąd zostanie przedstawiony w następnym alercie.'
              );
            const errorMessage: string = JSON.stringify(error);
            this.alertRef.changeStaticErrorMessage(errorMessage);
            this.update = false;  
           }
          }));
    }
    else{  
      this.alertRef.changeWarningMessage(
        `Wszystkie pola muszą być poprawnie wypełnione. Najedź kursorem na dane pole wpisywania aby dowiedzieć się więcej.`
        );
    }
  }
  this.update = false;
}
  getSemester(data: string): void {
    this.majorsForm.patchValue({ semester: data });
  }
}
