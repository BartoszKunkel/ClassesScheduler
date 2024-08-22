import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  emitter: EventEmitter<any> = new EventEmitter();
  clearEmmiter: EventEmitter<any> = new EventEmitter();
  hugeDropdownToggleEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor() { }
}
