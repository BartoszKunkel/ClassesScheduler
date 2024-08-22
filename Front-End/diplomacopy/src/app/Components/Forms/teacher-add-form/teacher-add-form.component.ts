import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { 
  FormControl,
  FormGroup, 
  FormsModule, 
  ReactiveFormsModule, 
  Validators } from '@angular/forms';
import { HttpService } from '../../../Services/http.service';
import { AlertComponent } from '../../Bootstrap/alert/alert.component';
import { Subscription } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Data } from '../../../Data/Data';
import { DropDownListComponent } from '../../MyComponents/dropdown-list/dropdown-list.component';
import { TeacherHttpService } from './teacher-http.service';
import { CustomValidators } from '../CustomValidators';
import { Teachers } from '../../../Data/Teachers';
import { DropdownService } from '../../MyComponents/dropdown-list/dropdown.service';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';
@Component({
  selector: 'app-teacher-add-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AlertComponent,
    NgbModule,
    DropDownListComponent
  ],

  templateUrl: './teacher-add-form.component.html',
  styleUrl: './teacher-add-form.component.scss'
})
export class TeacherAddFormComponent {
  @ViewChild('alertRef') alertRef: AlertComponent;
  teachersForm: FormGroup;
  private _subscription = new Subscription();
  id: number = null;
  update: boolean = false;

  constructor(
    private httpService: HttpService,
    private teachersHttpService: TeacherHttpService,
    private dropdownService: DropdownService
    ){
      this._subscription.add(teachersHttpService.emitter.subscribe(response => {
        if(response['trigger'] == true){
            this.updateTeacher(response['teacher']);   
            response['trigger'] = false;  
          }
      }));
    }
  
 
  
  degree_table: Data[] = [
    {id: 0, content: "prof."},
    {id: 1, content: "dr. hab."},
    {id: 2, content: "dr. hab. inż."},
    {id: 3, content: "dr."},
    {id: 4, content: "dr. inż."},
    {id: 5, content: "mgr."},
    {id: 6, content: "mgr. inż. "},
    {id: 7, content: "inż."}];

  ngOnInit(): void {
   this.teachersForm = new FormGroup({
    name: new FormControl<string>('',[
      Validators.required,
      Validators.compose(
        [
        CustomValidators.polishAlphabet,
        CustomValidators.onlySpaceAndHyphen
        ]
      ),
      Validators.maxLength(254)
    ]),
    surname: new FormControl<string>('',
    [Validators.required,
      Validators.compose(
        [
        CustomValidators.polishAlphabet,
        CustomValidators.onlySpaceAndHyphen
        ]
      ),
      Validators.maxLength(254)
    ]),
    a_degree: new FormControl<string>('',[
      Validators.required
    ])
  })
  }

  updateTeacher(received: Teachers): void {
    this.teachersForm.reset();
    this.teachersForm.patchValue({
      name: received.name,
      surname: received.surname,
      a_degree: received.a_degree
    })
    this.id = received.t_id;
    this.update = true;

  }

  submit(): void {
    const formData = this.teachersForm.value;
    formData.name = this.nameChecker(formData.name);
    formData.surname = this.nameChecker(formData.surname);
    if(!this.update){
    if(this.teachersForm.valid){
      this._subscription.add(this.httpService.postTeacher(formData)
      .subscribe({
        next:() => {
          this.alertRef.changeSuccessMessage(
            `Dodano rekord do bazy danych.`
            );
            this.teachersHttpService.updateTeachers$();
            this.dropdownService.clearEmmiter.emit(true);
            this.teachersForm.reset();
            console.log(this.teachersForm);
        },
        error:(error: any) => {
          this.alertRef.changeErrorMessage(
            'Coś poszło nie tak. Oto błąd zostanie przedstawiony w następnym alercie.'
            );
          const errorMessage: string = JSON.stringify(error);
          this.alertRef.changeStaticErrorMessage(errorMessage);
         },
        }));
  }
  else{  
    this.alertRef.changeWarningMessage(
      `Wszystkie pola muszą być poprawnie wypełnione. Najedź kursorem na dane pole wpisywania aby dowiedzieć się więcej.`
      );
  }}else{
    if(this.teachersForm.valid){
      this._subscription.add(this.httpService.partialUpdateTeacher(formData, this.id)
      .subscribe({
        next:() => {
          this.alertRef.changeSuccessMessage(
            `Edytowano rekord.`
            );
            this.teachersHttpService.updateTeachers$();
            this.dropdownService.clearEmmiter.emit(true);
            this.teachersForm.reset();
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
 

}
 
  nameChecker(s: string)
  {
    let rest = '';
    let firstChar = s.charAt(0);
    if(/[a-z]/.test(s.charAt(0)))
    {
       firstChar = s.charAt(0).toUpperCase();
    }
    if(/^[a-ząćęłńóśźż -]+$/i.test(s.substring(1)) && s.length > 1){
       rest = s.substring(1).toLowerCase();
    }
    console.log(firstChar);
    console.log(rest);
    return `${firstChar}` + `${rest}`;
  }

  getDegree(data: string)
  {

    this.teachersForm.patchValue({a_degree: data});

  }

}
