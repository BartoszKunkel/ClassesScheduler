import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

public tableDataEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
public dataEmitter: EventEmitter<any> = new EventEmitter<any>();
public dateEmitter: EventEmitter<any> = new EventEmitter<any>();
public disableEmitter: EventEmitter<any> = new EventEmitter<any>();
public radio1Emitter: EventEmitter<any> = new EventEmitter<any>();
public radio2Emitter: EventEmitter<any> = new EventEmitter<any>();
public classesDataEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
  constructor() { }
}
