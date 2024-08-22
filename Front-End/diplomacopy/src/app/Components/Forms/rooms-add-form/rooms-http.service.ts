import { Injectable ,EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, take } from "rxjs";
import { Rooms } from '../../../Data/Rooms';
import { HttpService } from '../../../Services/http.service';

@Injectable({
  providedIn: 'root'
})
export class RoomsHttpService {

  private _rooms$ = new BehaviorSubject<Rooms[]>([]);
  public emitter: EventEmitter<any> = new EventEmitter();
  constructor(private readonly httpService: HttpService) {}

  public getRooms$(): Observable<Rooms[]> {
    return this._rooms$.asObservable();
  }

  public updateRooms$(): void {
    this.httpService
      .getRooms()
      .pipe(take(1))
      .subscribe((updatedRooms) => {
        this._rooms$.next(updatedRooms);
      });
  }
}
