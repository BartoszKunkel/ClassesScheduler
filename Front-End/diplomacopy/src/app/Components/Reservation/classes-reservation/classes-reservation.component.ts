import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Classes } from '../../../Data/Classes';
import { Data } from '../../../Data/Data';
import { Rooms } from '../../../Data/Rooms';
import { DataService } from '../../../Services/data.service';
import { HttpService } from '../../../Services/http.service';
import { AlertComponent } from '../../Bootstrap/alert/alert.component';
import { SingleDatepickerComponent } from '../../Bootstrap/single-datepicker/single-datepicker.component';
import { DropDownListComponent } from '../../MyComponents/dropdown-list/dropdown-list.component';
import { DropdownService } from '../../MyComponents/dropdown-list/dropdown.service';
import { ClassesAddDropdownComponent } from '../classes-add-dropdown/classes-add-dropdown';
import { ClassesService } from './classes.service';

@Component({
  selector: 'app-classes-reservation',
  standalone: true,
  imports: [
    ClassesAddDropdownComponent,
    DropDownListComponent,
    SingleDatepickerComponent,
    AlertComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './classes-reservation.component.html',
  styleUrl: './classes-reservation.component.scss'
})
export class ClassesReservationComponent {
@ViewChild('alertRef') alertRef: AlertComponent;
private _subscription = new Subscription();
received;
dataSubscription: Subscription;
dateSubscription: Subscription;
hours: Data[] = this.generateHours();
s_time: number;
e_time: number;
date;

rooms: Data[];
roomsInstance = new Rooms();
cleanData: Data[] = [];

classesUpdateSTime: Data;
classesUpdateETime: Data;

id: number;
update: boolean = false;

constructor(
  private httpService: HttpService,
  private dataService: DataService,
  private dropdownService: DropdownService,
  private classesService: ClassesService){
  this._subscription.add(this.dataService.dataEmitter.subscribe(data => {
    this.received = data;
  }));
  this._subscription.add(this.dataService.dateEmitter.subscribe(data => {
    this.date = data;
   }));
  this._subscription.add(this.classesService.emitter.subscribe(data => {
  
    const start_time: string = data['classes']['start_time'];
    const end_time: string = data['classes']['end_time'];
    const splitST: string[] = start_time.split(" ");
    const splitET: string[] = end_time.split(" ");
    

    for(let hour of this.hours)
    {
      if(splitST[1] == hour.content)
      {
        this.classesUpdateSTime = hour;
      }
      else if(splitET[1] == hour.content)
      {
        this.classesUpdateETime = hour;
      }
    }
  
    if(data['trigger'] == true){
      this.updateClasses(data['classes']);
    }
  })
  
  
  )
 
}


ngOnDestroy() {
  this._subscription.unsubscribe()
}

updateClasses(received: Classes): void {
  this.id = received.c_id;
  this.update = true;

}

submit()
  {
    
    if(this.date === undefined){
      this.alertRef.changeSuccessMessage(`Data odbywania się zajęć musi być wybrana`)
    }else{
      if(this.s_time === undefined || this.e_time === undefined)
      {
        this.alertRef.changeSuccessMessage(`Czas rozpoczęcia oraz zakończenia zajęć musi zostać wybrany`);
      }else
      {
        if(this.received === undefined)
           {
            this.alertRef.changeSuccessMessage(`Aby zarezerwować termin należy wybrać salę, kierunek, przedmiot oraz prowadzącego`);
           }else{
            const start = this.setTime(0);
            const end = this.setTime(1);
            const classes = new Classes(this.received["majorid"], this.received["roomid"], this.received["subjectid"],this.received["teacherid"], start, end);
          if(!this.update){
          this._subscription.add(this.httpService.postClasses(classes).subscribe({
          next:() =>{
            this.dropdownService.clearEmmiter.emit(true);
            this.classesService.updateClasses$();
           this.alertRef.changeSuccessMessage(`Dodano rekord do bazy danych.`)
           },
           error:(error: any) =>{
               this.alertRef.changeErrorMessage(
              'Coś poszło nie tak. Oto błąd zostanie przedstawiony w następnym alercie.'
               );
          const errorMessage: string = JSON.stringify(error);
          this.alertRef.changeStaticErrorMessage(errorMessage);
         
        }
      }))}else{
        this._subscription.add(this.httpService.partialUpdateClasses(classes, this.id).subscribe({
          next:() =>{
            this.dropdownService.clearEmmiter.emit(true);
           this.alertRef.changeSuccessMessage(`Edytowano rekord`);
           this.classesService.updateClasses$();
           },
           error:(error: any) =>{
               this.alertRef.changeErrorMessage(
              'Coś poszło nie tak. Oto błąd zostanie przedstawiony w następnym alercie.'
               );
          const errorMessage: string = JSON.stringify(error);
          this.alertRef.changeStaticErrorMessage(errorMessage);
         
        }
      }))
      }
    }    
    }
    }
  }

setTime(sele: number): string
{
  if(sele == 0) return this.date['year']+ `-` +this.fill(this.date, 'month') + `-` + this.fill(this.date, 'day') + ` ` + this.hours[this.s_time].content;
  else return this.date['year']+ `-` + this.fill(this.date, 'month')+ `-` + this.fill(this.date,'day') + ` ` + this.hours[this.e_time].content;
}
  

fill(date: any, indicator: string)
{
  if(date[`${indicator}`] < 10) return `0` + date[`${indicator}`]
  else return date[`${indicator}`];
}

generateHours(): Data[]
{
  const hours: Data [] = [];
  let i = 14;
  let j: number = 0;
  let hour: string;
  for(i ; i<=46 ; i++){
    if(i%2==0){
      if(Math.floor(i/2) < 10){
       hour = `0`+Math.floor(i/2)+`:`+`00`;
      }else {
       hour = Math.floor(i/2)+`:`+`00`;
      }
      hours.push(new Data(j, hour));
      j++;
      
    }else{
      if(Math.floor(i/2) < 10){
        hour = `0`+Math.floor(i/2)+`:`+`30`;
       }else {
        hour = Math.floor(i/2)+`:`+`30`;
       }
      hours.push(new Data(j, hour));
      j++
    }
  }

  return hours;
}

getRooms(){
  if(this.date === undefined || this.s_time === undefined || this.e_time === undefined){
    return null;
  }
  else{

   
    if(this.e_time < this.s_time){
      console.log("dalej źle")
      this.alertRef.changeErrorMessage("BŁĄD: Godzina zakończenia zajęć poprzedza godzinę zakończenia zajęć");
      this.dataService.tableDataEmitter.emit(this.cleanData);
      return null;
    }else{
      console.log("tera dobrze")
    const start = this.setTime(0);
    const end = this.setTime(1);
    this.dataSubscription = this.httpService.filterRooms(start, end).subscribe(data => {
      console.log(data) 
      this.dataService.tableDataEmitter.emit(this.roomsInstance.convertToData(
        this.roomsInstance.convertFromJSON(
          JSON.parse(
            JSON.stringify(data)))));
    });
    setTimeout(() => {
      this.dataSubscription.unsubscribe();
    }, 500);
   
  }
  
  }
}

}