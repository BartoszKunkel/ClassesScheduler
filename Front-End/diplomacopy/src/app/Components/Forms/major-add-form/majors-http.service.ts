import { Injectable, EventEmitter } from "@angular/core";
import { BehaviorSubject, Observable, take } from "rxjs";
import { Majors } from "../../../Data/Majors";
import { HttpService } from "../../../Services/http.service";

@Injectable({
  providedIn: "root",
})
export class MajorsHttpService {
  private _majors$ = new BehaviorSubject<Majors[]>([]);
  public emitter: EventEmitter<any> = new EventEmitter();
  constructor(private readonly httpService: HttpService) {}

  public getMajors$(): Observable<Majors[]> {
    return this._majors$.asObservable();
  }

  public updateMajors$(): void {
    this.httpService
      .getMajors()
      .pipe(take(1))
      .subscribe((updatedMajors) => {
        this._majors$.next(updatedMajors);
      });
  }
}
