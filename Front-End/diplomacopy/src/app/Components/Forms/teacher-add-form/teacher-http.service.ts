import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Teachers } from '../../../Data/Teachers';
import { HttpService } from '../../../Services/http.service';
@Injectable({
  providedIn: 'root'
})
export class TeacherHttpService {

  private _teachers$ = new BehaviorSubject<Teachers[]>([]);
  public emitter: EventEmitter<any> = new EventEmitter();
  constructor(private readonly httpService: HttpService) {}

  public getTeacher$(): Observable<Teachers[]> {
    return this._teachers$.asObservable();
  }

  public updateTeachers$(): void {
    this.httpService
      .getTeachers()
      .pipe(take(1))
      .subscribe((updatedTeachers) => {
        this._teachers$.next(updatedTeachers);
      });
  }
}
