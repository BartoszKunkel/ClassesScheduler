import { TaggedTemplateExpr } from '@angular/compiler';
import { Component, ChangeDetectorRef, Input} from '@angular/core';
import { Subscription } from 'rxjs';
import { Classes } from '../../../Data/Classes';
import { ClassesEntity } from '../../../Data/ClassesEntity';
import { Data } from '../../../Data/Data';
import { Majors } from '../../../Data/Majors';
import { Rooms } from '../../../Data/Rooms';
import { Subjects } from '../../../Data/Subjects';
import { Teachers } from '../../../Data/Teachers';
import { DataService } from '../../../Services/data.service';
import { HttpService } from '../../../Services/http.service';
import { DatepickerComponent } from '../../Bootstrap/datepicker/datepicker.component';
import { DropDownListComponent } from '../../MyComponents/dropdown-list/dropdown-list.component';
import { ClassesService } from '../classes-reservation/classes.service';

@Component({
  selector: 'app-classes-add-dropdown',
  standalone: true,
  imports: [DatepickerComponent, DropDownListComponent],
  templateUrl: './classes-add-dropdown.component.html',
  styleUrl: './classes-add-dropdown.component.scss'
})
export class ClassesAddDropdownComponent {
@Input() date: any;
//Variables needed to create new Classes object
classesInstance = new Classes();
r_id: number;
m_id: number;
s_id: number;
t_id: number;

//
private _subscription = new Subscription();
received;
receivedData: any[];

//Class instances declared for method use
roomsInstance = new Rooms();
majorsInstance = new Majors();
subjectsInstance = new Subjects();
teachersInstance = new Teachers();

//Class tables declared for injecting data to dropdowns
rooms: Data[] = [];
majors: Data[] = [];
teachers: Data[] = [];
subjects: Data[] = [];

dataRoom: Data;
dataMajor: Data;
dataSubject: Data;
dataTeacher: Data;
constructor (private httpService: HttpService, private dataService: DataService, private classesService: ClassesService){
  this._subscription.add(this.dataService.tableDataEmitter.subscribe(data => {
    this.rooms = data;
    if(this.rooms.length != 0){
    this.sortByContent(this.rooms);
    }
  }));
  this._subscription.add(this.classesService.emitter.subscribe(data =>{
      const room: Rooms = data['classes']['roomid'];
      const major: Majors = data['classes']['majorid'];
      const subject: Subjects = data['classes']['subjectid'];
      const teacher: Teachers = data['classes']['teacherid'];
      this.dataRoom = this.roomsInstance.convertOneToData(room);
      this.dataMajor = this.majorsInstance.convertOneToData(major);
      this.dataSubject = this.subjectsInstance.convertOneToData(subject);
      this.dataTeacher = this.teachersInstance.convertOneToData(teacher);
  
    }))
}


setData(data: number, choose: number){
  switch(choose)
  {
    case 0:
    this.classesInstance.roomid = data;
      break;
    case 1:
      this.classesInstance.majorid = data;
      break;
    case 2:
      this.classesInstance.subjectid = data;
      break;
    case 3:
      this.classesInstance.teacherid = data;
      break;
 }

 if(this.classesInstance.roomid != null && this.classesInstance.majorid != null && this.classesInstance.subjectid != null && this.classesInstance.teacherid != null){
  this.dataService.dataEmitter.emit(this.classesInstance);
 }
} 

ngOnInit()
{
  this.getData();
}

ngOnDestroy()
{
  this._subscription.unsubscribe();
}
getData(){
  this._subscription.add(this.httpService.getMajors().subscribe(data => {
    this.majors = this.majorsInstance.convertToData(
      this.majorsInstance.convertFromJSON(
        JSON.parse(
          JSON.stringify(data))), "all", true);
    this.sortByContent(this.majors);
  }));

  this._subscription.add(this.httpService.getSubjects().subscribe(data => {
    this.subjects = this.subjectsInstance.convertToData(
      this.subjectsInstance.convertFromJSON(
        JSON.parse(
          JSON.stringify(data))));
    this.sortByContent(this.subjects);
  }));

  this._subscription.add(this.httpService.getTeachers().subscribe(data => {
    this.teachers = this.teachersInstance.convertToData(
      this.teachersInstance.convertFromJSON(
        JSON.parse(
          JSON.stringify(data))));

    this.sortByContent(this.teachers);
  }));
}


sortByContent(dataArray: Data[]){
    dataArray.sort((a,b)=> {
    if(a.content < b.content){
      return -1;
    }else if(a.content > b.content){
      return 1;
    }
    return 0;
  })
}



}
