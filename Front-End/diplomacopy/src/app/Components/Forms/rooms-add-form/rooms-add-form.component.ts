import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Rooms } from '../../../Data/Rooms';
import { HttpService } from '../../../Services/http.service';
import { AlertComponent } from '../../Bootstrap/alert/alert.component';
import { RoomsHttpService } from './rooms-http.service';

@Component({
  selector: 'app-rooms-add-form',
  standalone: true,
  imports: [
    NgbModule, 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    AlertComponent],
  templateUrl: './rooms-add-form.component.html',
  styleUrl: './rooms-add-form.component.scss'
})
export class RoomsAddFormComponent {
@ViewChild('alertRef') alertRef: AlertComponent;
  roomsForm: FormGroup;
  private _subscription = new Subscription(); 
  id: number = null;
  update: boolean = false;
  


  constructor(
    private httpService: HttpService,
    private roomsHttpService: RoomsHttpService
    ){
      this._subscription.add(roomsHttpService.emitter.subscribe(response => {
      if(response['trigger'] == true){
          this.updateRoom(response['room']); 
          response['trigger'] = false;   
        }
    }));
  }
  
 
  
  ngOnInit(): void {
    this.roomsForm = new FormGroup({
      building: new FormControl<string>('',[
        Validators.required,
        Validators.pattern('[a-zA-Z ]*'),
        Validators.maxLength(254)]),
      numer: new FormControl<BigInt>(null,[
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.maxLength(254)]),
      suffix: new FormControl<string>('',[
        Validators.pattern('[a-zA-Z ]*'),
        Validators.maxLength(254)]),
    })
  }

  ngOnDestroy(): void{
    this._subscription.unsubscribe();
  }

  updateRoom(received: Rooms): void {
    this.roomsForm.reset();
    this.roomsForm.patchValue({
      building: received.building,
      numer: received.numer,
      suffix: received.suffix
    })
    this.id = received.r_id;
    this.update = true;
  }

  submit(): void {
    const formData = this.roomsForm.value;
    formData.building = this.checkForLowerCase(formData.building);
    if(formData.suffix != null && formData.suffix != undefined){
    formData.suffix = this.checkForLowerCase(formData.suffix);
    }
    if(!this.update){
    if(this.roomsForm.valid){
      this._subscription.add(this.httpService.postRoom(formData)
      .subscribe({
        next:() => {
          this.alertRef.changeSuccessMessage(
            `Dodano rekord do bazy danych.`
            );
            this.roomsHttpService.updateRooms$();
            this.roomsForm.reset();
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
  if(this.roomsForm.valid){
    this._subscription.add(this.httpService.partialUpdateRoom(formData, this.id)
    .subscribe({
      next:() => {
        this.alertRef.changeSuccessMessage(
          `Edytowano rekord.`
          );
          this.roomsHttpService.updateRooms$();
          this.roomsForm.reset();
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
      }));}
    }
    this.update = false;
  }
  
 
checkForLowerCase(s: string)
{
  if(/[a-z]/.test(s))
  {
    s = s.toUpperCase();
    console.log(s);
  }
  return s;
}


}
