import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Classes } from "../Data/Classes";
import { Majors } from "../Data/Majors";
import { Rooms } from "../Data/Rooms";
import { Subjects } from "../Data/Subjects";
import { Teachers } from "../Data/Teachers";
import { Observable } from "rxjs";
import { Login } from "../Data/Login";
import { CookieService } from "ngx-cookie-service";
import { ClassesEntity } from "../Data/ClassesEntity";
import { Registration } from "../Data/Registration";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  header: HttpHeaders = new HttpHeaders();
  constructor(private http: HttpClient, private coockies: CookieService) {
    this.header = new HttpHeaders({
      'Authorization': 'Bearer ' + this.coockies.get('token')
    });
  }



  //Post mapping classes

  postClasses(data) {
    return this.http.post("http://localhost:8080/classes", data,
    {headers: this.header});
  }

  postClassesp(data, ammount: number) {
    return this.http.post(`http://localhost:8080/classesp/${ammount}`, data,
    {headers: this.header});
  }

  //Post mapping Rooms

  postRoom(data) {
    return this.http.post("http://localhost:8080/rooms", data,
    {headers: this.header});
  }

  //Post mapping majors

  postMajor(data) {
    return this.http.post("http://localhost:8080/major", data,
    {headers: this.header});
  }

  //Post mapping Subjects

  postSubject(data) {
    return this.http.post("http://localhost:8080/subject", data,
    {headers: this.header});
  }

  //Post mapping teachers

  postTeacher(data) {
    return this.http.post("http://localhost:8080/teacher", data,
    {headers: this.header});
  }

  //Get mapping classes

  getClasses() {
    return this.http.get("http://localhost:8080/classes",
    {headers: this.header}) as Observable<ClassesEntity[]>;
  }

  getSortedClasses(m_id: number) {
    return this.http.get(`http://localhost:8080/sortclasses/${m_id}`,
    {headers: this.header});
  }

  //Get mapping Rooms

  getRooms() {
    return this.http.get("http://localhost:8080/rooms",
    {headers: this.header}) as Observable<Rooms[]>;
  }

  getRoomById(r_id: number) {
    return this.http.get(`http://localhost:8080/rooms/${r_id}`,
    {headers: this.header});
  }

  filterRooms(start: string, end: string) {
    return this.http.get(
      `http://localhost:8080/rooms/filtered/${start}/${end}`,
      {headers: this.header}
    );
  }

  filterManyRooms(start: string, end: string) {
    return this.http.get(
      `http://localhost:8080/rooms/filtermany/${start}/${end}`,
      {headers: this.header});
  }

  //Get mapping majors

  getMajors(): Observable<Majors[]> {
    
    return this.http.get("http://localhost:8080/major", 
    {headers: this.header}) as Observable<Majors[]>;
  }

  filterMajors(major, group: number) {
    return this.http.post(`http://localhost:8080/majorfilter/${group}`, major,
     {headers: this.header});
  }

  //Get mapping subjects

  getSubjects() {
    return this.http.get("http://localhost:8080/subjects",
    {headers: this.header}) as Observable<Subjects[]>;
  }

  getSubjectById(s_id: number) {
    return this.http.get(`http://localhost:8080/subjects/${s_id}`,
    {headers: this.header});
  }

  //Get mapping teachers

  getTeachers() {
    return this.http.get("http://localhost:8080/teacher",
    {headers: this.header}) as Observable<Teachers[]>;
  }

  getTeacherById(t_id: number) {
    return this.http.get(`http://localhost:8080/teacher/${t_id}`,
    {headers: this.header});
  }

  //Put & patch mapping classes
  fullUpdateClasses(c: Classes, c_id: number) {
    return this.http.put(`http://localhost:8080/classes/${c_id}`, c,
    {headers: this.header});
  }

  partialUpdateClasses(c: Classes, c_id: number) {
    return this.http.patch(`http://localhost:8080/classes/${c_id}`, c,
    {headers: this.header});
  }

  //Put & patch mapping rooms
  fullUpdateRoom(r: Rooms, r_id: number) {
    return this.http.put(`http://localhost:8080/rooms/${r_id}`, r,
    {headers: this.header});
  }

  partialUpdateRoom(r: Rooms, r_id: number) {
    return this.http.patch(`http://localhost:8080/rooms/${r_id}`, r,
    {headers: this.header});
  }

  //Put & patch mapping majors
  fullUpdateMajor(m, m_id: number) {
    return this.http.put(`http://localhost:8080/major/${m_id}`, m,
    {headers: this.header});
  }

  partialUpdateMajor(m, m_id: number) {
    return this.http.patch(`http://localhost:8080/major/${m_id}`, m,
    {headers: this.header});
  }

  //Put & patch mapping subjects
  fullUpdateSubject(s: Subjects, s_id: number) {
    return this.http.put(`http://localhost:8080/subjects/${s_id}`, s,
    {headers: this.header});
  }

  partialUpdateSubject(s: Subjects, s_id: number) {
    return this.http.patch(`http://localhost:8080/subjects/${s_id}`, s,
    {headers: this.header});
  }

  //Put & patch mapping teachers
  fullUpdateTeacher(t: Teachers, t_id: number) {
    return this.http.put(`http://localhost:8080/teacher/${t_id}`, t,
    {headers: this.header});
  }

  partialUpdateTeacher(t: Teachers, t_id: number) {
    return this.http.patch(`http://localhost:8080/teacher/${t_id}`, t,
    {headers: this.header});
  }

  //Delete mapping classes

  deleteClasses(c_id: number) {
    return this.http.delete(`http://localhost:8080/classes/${c_id}`,
    {headers: this.header});
  }

  //Delete mapping rooms

  deleteRoom(r_id: number) {
    return this.http.delete(`http://localhost:8080/rooms/${r_id}`,
    {headers: this.header});
  }

  //Delete mapping majors

  deleteMajor(m_id: number) {
    return this.http.delete(`http://localhost:8080/major/${m_id}`,
    {headers: this.header});
  }

  //Delete mapping Subjects

  deleteSubject(s_id: number) {
    return this.http.delete(`http://localhost:8080/subjects/${s_id}`,
    {headers: this.header});
  }

  //Delete mapping teachers

  deleteTeacher(t_id: number) {
    return this.http.delete(`http://localhost:8080/teacher/${t_id}`,
    {headers: this.header});
  }


  //Authorization 

  login(login: Login){
    return this.http.post(`http://localhost:8080/login`, login,
    {headers: this.header});
  }

  register(register: Registration){
    return this.http.post(`http://localhost:8080/register`, register,
    {headers: this.header});
  }

  getRegister(){
    return this.http.get(`http://localhost:8080/login`, 
    {headers: this.header}) as Observable<Registration[]>;
  }

  partialUpdateRegister(r: Registration, id: number)
  {
    return this.http.patch(`http://localhost:8080/register/${id}`, r,
    {headers: this.header})
  }

  deleteUser(id: number){
    return this.http.delete(`http://localhost:8080/login/${id}`,
    {headers: this.header})

  }
}
