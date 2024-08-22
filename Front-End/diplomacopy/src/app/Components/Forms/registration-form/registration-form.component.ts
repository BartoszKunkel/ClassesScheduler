import { CommonModule} from '@angular/common';
import { Component, ViewChild  } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpService } from '../../../Services/http.service';
import { AlertComponent } from '../../Bootstrap/alert/alert.component';
import { DropDownListComponent } from '../../MyComponents/dropdown-list/dropdown-list.component';
import { DropdownService } from '../../MyComponents/dropdown-list/dropdown.service';
import { RegistrationService } from './registration.service';
import { Subscription } from "rxjs";
import { CustomValidators } from '../CustomValidators';
import { Registration } from '../../../Data/Registration';
import { Data } from '../../../Data/Data';
@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AlertComponent,
    NgbModule,
    DropDownListComponent
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent {
  @ViewChild('alertRef') alertRef: AlertComponent;
  registrationForm: FormGroup;
  private _subscription = new Subscription();
  id: number = null;
  update: boolean = false;

  constructor(
    private httpService: HttpService,
    private registrationHttpService: RegistrationService,
    private dropdownService: DropdownService
    ){
      this._subscription.add(registrationHttpService.emitter.subscribe(response => {
        if(response['trigger'] == true){
            this.updateRegister(response['teacher']);   
          }
      }));
    }
  
 
  
  access_table: Data[] = [
    {id: 0, content: "Student"},
    {id: 1, content: "Starosta"},
    {id: 2, content: "Prowadzący"},
    {id: 3, content: "Planista"},
    {id: 4, content: "Admin"},
  ];

  ngOnInit(): void {
   this.registrationForm = new FormGroup({
    firstName: new FormControl<string>('',[
      Validators.required,
      Validators.compose(
        [
        CustomValidators.polishAlphabet,
        CustomValidators.onlySpaceAndHyphen
        ]
      ),
      Validators.maxLength(254)
    ]),
    lastName: new FormControl<string>('',
    [Validators.required,
      Validators.compose(
        [
        CustomValidators.polishAlphabet,
        CustomValidators.onlySpaceAndHyphen
        ]
      ),
      Validators.maxLength(254)
    ]),
    login: new FormControl<string>('',
    [Validators.required,
      Validators.compose(
        [
        CustomValidators.polishAlphabet,
        CustomValidators.onlySpaceAndHyphen
        ]
      ),
      Validators.maxLength(254)
    ]),
    password: new FormControl<string>('',
    [Validators.required,
      Validators.compose(
        [
        CustomValidators.polishAlphabet,
        CustomValidators.onlySpaceAndHyphen
        ]
      ),
      Validators.maxLength(254)
    ]),
    accesslvl: new FormControl<string>('',[
      Validators.required
    ])
  })
  }

  updateRegister(received: Registration): void {
    this.registrationForm.reset();
    this.registrationForm.patchValue({
      firstName: received.firstName,
      lastName: received.lastName,
      login: received.login,
      password: received.password   })
    this.id = received.id;
    this.update = true;

  }

  submit(): void {
    const formData = this.registrationForm.value;
    formData.firstName = this.nameChecker(formData.firstName);
    formData.lastName = this.nameChecker(formData.lastName);

    if(!this.update){
    if(this.registrationForm.valid){
      this._subscription.add(this.httpService.register(formData)
      .subscribe({
        next:() => {
          this.alertRef.changeSuccessMessage(
            `Dodano rekord do bazy danych.`
            );
            this.registrationHttpService.updateRegistration$();
            this.dropdownService.clearEmmiter.emit(true);
            this.registrationForm.reset();
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
    if(this.registrationForm.valid){
      this._subscription.add(this.httpService.partialUpdateRegister(formData, this.id)
      .subscribe({
        next:() => {
          this.alertRef.changeSuccessMessage(
            `Edytowano rekord.`
            );
            this.registrationHttpService.updateRegistration$();
            this.dropdownService.clearEmmiter.emit(true);
            this.registrationForm.reset();
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
    if(/^[a-z]+$/i.test(s.substring(1)) && s.length > 1){
       rest = s.substring(1).toLowerCase();
    }
    return `${firstChar}` + `${rest}`;
  }

  getDegree(data: string)
  {

    this.registrationForm.patchValue({accesslvl: data});

  }

}
