import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { 
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { HttpService } from '../../../Services/http.service';
import { AlertComponent } from '../../Bootstrap/alert/alert.component';
import { SubjectsHttpService } from './subjects-http.service';
import { CustomValidators } from '../CustomValidators';
import { Subjects } from '../../../Data/Subjects';

@Component({
  selector: 'app-subject-add-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule, 
    AlertComponent,
    NgbModule],
  templateUrl: './subject-add-form.component.html',
  styleUrl: './subject-add-form.component.scss'
})
export class SubjectAddFormComponent {
  @ViewChild('alertRef') alertRef: AlertComponent;
  subjectsForm: FormGroup;
  private _subscription = new Subscription();
  id: number = null;
  update: boolean = false;
  
  
  constructor(
    private httpService: HttpService,
    private subjectsHttpService: SubjectsHttpService
    ){
      this._subscription.add(subjectsHttpService.emitter.subscribe(response => {
        if(response['trigger'] == true){
            this.updateSubject(response['subject']);   
            response['trigger'] = false;
          }
      }));
    }
  
  
  ngOnInit(): void {
   this.subjectsForm = new FormGroup({
      name: new FormControl<string>('',
      [
        Validators.required,
        Validators.compose(
          [
          CustomValidators.polishAlphabet,
          CustomValidators.onlySpaceAndHyphen
          ]
        ),
        Validators.maxLength(254),
      ]),
    })
  }

  ngOnDestroy(): void{
    this._subscription.unsubscribe();
  }

  updateSubject(received: Subjects): void {
    this.subjectsForm.reset();
    this.subjectsForm.patchValue({
      name: received.name
    })
    this.id = received.s_id;
    this.update = true;
  }


  submit(): void {
    
    const formData = this.subjectsForm.value;
    formData.name = this.checkForLowerCase(formData.name);

    if(!this.update){
    if(this.subjectsForm.valid){
      this._subscription.add(this.httpService.postSubject(formData)
      .subscribe({
        next:() => {
          this.alertRef.changeSuccessMessage(
            `Dodano rekord do bazy danych.`
            );
            this.subjectsHttpService.updateSubjects$();
            this.subjectsForm.reset();
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
  }
  }else{
    if(this.subjectsForm.valid){
      this._subscription.add(this.httpService.partialUpdateSubject(formData, this.id)
      .subscribe({
        next:() => {
          this.alertRef.changeSuccessMessage(
            `Edytowano rekord.`
            );
            this.subjectsHttpService.updateSubjects$();
            this.subjectsForm.reset();
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
 
  checkForLowerCase(s: string)
  {
    let firstChar;
    let result = s;
    if(/[a-z]/.test(s.charAt(0)))
    {
      firstChar = s.charAt(0).toUpperCase();
      result = `${firstChar}` + `${s.substring(1)}`
    }
    return result;
  }



}
