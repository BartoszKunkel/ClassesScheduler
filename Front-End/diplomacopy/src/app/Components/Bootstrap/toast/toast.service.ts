import { Injectable } from "@angular/core";

export interface Toast {
  message: string;
  classname?: string;
  delay?: number;
}

@Injectable({ providedIn: "root" })
export class ToastService {
  toasts: Toast[] = [];

  show(toast: Toast) {
    this.toasts.push(toast);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  showStandard(message: string) {
    this.show({ message, classname: "bg-success text-light", delay: 5000 });
  }

  showSuccess(message: string) {
    this.show({ message, classname: "bg-success text-light", delay: 5000 });
  }

  showDanger(message: string) {
    this.show({ message, classname: "bg-danger text-light", delay: 5000 });
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
