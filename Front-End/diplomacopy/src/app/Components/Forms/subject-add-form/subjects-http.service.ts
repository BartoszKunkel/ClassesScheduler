import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Subjects } from '../../../Data/Subjects';
import { HttpService } from '../../../Services/http.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectsHttpService {

  private _subjects$ = new BehaviorSubject<Subjects[]>([]);
  public emitter: EventEmitter<any> = new EventEmitter();
  
  constructor(private readonly httpService: HttpService) {}

  public getSubjects$(): Observable<Subjects[]> {
    return this._subjects$.asObservable();
  }

  public updateSubjects$(): void {
    this.httpService
      .getSubjects()
      .pipe(take(1))
      .subscribe((updatedSubjects) => {
        this._subjects$.next(updatedSubjects);
      });
  }

  

}
