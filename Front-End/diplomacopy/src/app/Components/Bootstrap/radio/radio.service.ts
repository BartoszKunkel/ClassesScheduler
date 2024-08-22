import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RadioService {
  cleanRadio: EventEmitter<any> = new EventEmitter();
  constructor() { }
}
