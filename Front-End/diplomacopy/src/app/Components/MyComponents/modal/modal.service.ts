import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalStates = new Map<string, BehaviorSubject<boolean>>();

  constructor() { }

  public getModalState(modalName: string): Observable<boolean> {
    if (!this.modalStates.has(modalName)) {
      this.modalStates.set(modalName, new BehaviorSubject<boolean>(false));
    }

    return this.modalStates.get(modalName).asObservable();
  }

  public toggleModal(modalName: string, value: boolean): void {
    if (!this.modalStates.has(modalName)) {
      this.modalStates.set(modalName, new BehaviorSubject<boolean>(value));
    } else {
      this.modalStates.get(modalName).next(value);
    }

    value ? this.setFixedBody() : this.removeFixedBody();
  }

  private setFixedBody() {
    document.body.style.height = '100vh';
    document.body.style.maxHeight = '100vh';
    document.body.style.overflow = 'hidden';
  }

  private removeFixedBody() {
    document.body.style.height = 'auto';
    document.body.style.maxHeight = 'auto';
    document.body.style.overflow = 'auto';
  }
}
