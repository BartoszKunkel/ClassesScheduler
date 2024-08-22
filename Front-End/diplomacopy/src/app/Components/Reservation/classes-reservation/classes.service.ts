import { Injectable, EventEmitter } from "@angular/core";
import { BehaviorSubject, Observable, take, map } from "rxjs";
import { Classes } from "../../../Data/Classes";
import { ClassesEntity } from "../../../Data/ClassesEntity";
import { HttpService } from "../../../Services/http.service";

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private _classes$ = new BehaviorSubject<ClassesEntity[]>([]);
  public emitter: EventEmitter<any> = new EventEmitter();
  public dataEmitter: EventEmitter<any> = new EventEmitter();
  constructor(private readonly httpService: HttpService) {}

  public getClasses$(): Observable<ClassesEntity[]> {
    return this._classes$.asObservable();
  }

  public updateClasses$(): void {
    this.httpService
      .getClasses()
      .pipe(
        map(updatedClasses => this.transformClasses(updatedClasses))
      )
      .subscribe((transformedClasses) => {
        this._classes$.next(transformedClasses);
      });
  }

  private transformClasses(classes: any[]): ClassesEntity[]{
    return classes.map(classesItem => ({
      ...classesItem,
      majorName: `${classesItem.majorid.name}` + ` ` + `${classesItem.majorid.specialization}` + ` ` + `${classesItem.majorid.study_year}`,
      fullRoom: `${classesItem.roomid.building}` + `${classesItem.roomid.numer}` + `${classesItem.roomid.suffix}`,
      fullTeacher:   `${classesItem.teacherid.a_degree}` + `${classesItem.teacherid.name}` + ` ` + `${classesItem.teacherid.surname}`,
      subjectName: `${classesItem.subjectid.name}`,
    }));
  }
}
