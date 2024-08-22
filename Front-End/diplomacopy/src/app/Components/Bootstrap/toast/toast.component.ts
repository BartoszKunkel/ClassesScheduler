import { Component, inject } from "@angular/core";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "./toast.service";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [NgbToastModule],
  templateUrl: "./toast.component.html",
  styleUrl: "./toast.component.scss",
  host: {
    class: "toast-container position-fixed bottom-0 end-0 px-3 py-5",
    style: "z-index: 1200",
  },
})
export class ToastComponent {
  toastService = inject(ToastService);
}
