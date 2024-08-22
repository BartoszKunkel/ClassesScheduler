import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Classes } from '../../../Data/Classes';
import { Data } from '../../../Data/Data';
import { Rooms } from '../../../Data/Rooms';
import { DataService } from '../../../Services/data.service';
import { HttpService } from '../../../Services/http.service';
import { AlertComponent } from '../../Bootstrap/alert/alert.component';
import { DatepickerComponent } from '../../Bootstrap/datepicker/datepicker.component';
import { DropDownListComponent } from '../../MyComponents/dropdown-list/dropdown-list.component';
import { ClassesAddDropdownComponent } from '../classes-add-dropdown/classes-add-dropdown';

@Component({
  selector: 'app-classes-periodic-reservation',
  standalone: true,
  imports: [ClassesAddDropdownComponent, DropDownListComponent,DatepickerComponent, AlertComponent],
  templateUrl: './classes-periodic-reservation.component.html',
  styleUrl: './classes-periodic-reservation.component.scss'
})
export class ClassesPeriodicReservationComponent {
@ViewChild('alertRef') alertRef: AlertComponent;
dataSubscription: Subscription;
dateSubscription: Subscription;
hours: Data[] = this.generateHours();
s_time: number;
e_time: number;
ammount: number;
received;
date;

rooms: Data[];
roomsInstance = new Rooms();
cleanData: Data[] = [];

ammount_table: Data[] =[
  {
    id: 1, content: "1"
  },{
    id: 2, content: "2"
  }
]

constructor(private httpService: HttpService, private dataService: DataService){
  this.dataSubscription = this.dataService.dataEmitter.subscribe(data => {
    this.received = data;
  });
  this.dateSubscription = this.dataService.dateEmitter.subscribe(data => {
    this.date = data;
   });
}


ngOnDestroy() {
  this.dataSubscription.unsubscribe();
  this.dateSubscription.unsubscribe();
}

testEndpoint(){
  const start = this.setTime(0);
  const end = this.setTime(1);

  this.httpService.filterRooms(start, end).subscribe(data => {
    console.log(JSON.stringify(data));
  });

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
    
      this.httpService.postClassesp(classes, this.ammount).subscribe(response => {
        console.log('Response:', response);
      }, error => {
        console.error('Error:', error)
      });
    }    
    }
    }
  }

setTime(sele: number): string
{
  if(sele == 0) return this.date[0]['year']+
   `-` + this.fill(this.date, 'month', 0) +
    `-` + this.fill(this.date, 'day', 0) +
     ` ` + this.hours[this.s_time].content;
  else return this.date[1]['year']+
   `-` +this.fill(this.date, 'month', 1)+
    `-` +this.fill(this.date, 'day', 1) +
     ` ` + this.hours[this.e_time].content;
}

fill(date: any, indicator: string, selector: number)
{
  if(date[selector][`${indicator}`] < 10) return `0` + date[selector][`${indicator}`]
  else return date[selector][`${indicator}`];
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
    this.dataSubscription = this.httpService.filterManyRooms(start, end).subscribe(data => {
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
