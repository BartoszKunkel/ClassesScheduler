import { Component, Input, OnInit } from "@angular/core";
import { AsyncPipe, NgClass, NgFor, NgIf, NgStyle } from "@angular/common";
import { ModalService } from "./modal.service";
import { Observable } from "rxjs";

interface ModalDimensions {
  size: string;
  width: string;
  height: string;
  maxHeight?: string;
}

@Component({
  selector: "app-modal",
  standalone: true,
  imports: [NgFor, NgClass, AsyncPipe, NgIf, NgStyle],
  templateUrl: "./modal.component.html",
  styleUrl: "./modal.component.scss",
})
export class ModalComponent implements OnInit {
  @Input() modalName: string;
  @Input() headerLabel: string;
  @Input() leftButton: { label: string; action: (...params: any[]) => void } = {
    label: "Anuluj",
    action: () => this.closeModal(),
  };
  @Input() rightButtons: {
    label: string;
    action: (...params: any[]) => void;
  }[];
  @Input() rightButton: { label: string; action: (...params: any[]) => void } =
    {
      label: "Zapisz",
      action: () => this.saveData(),
    };
  @Input() size: "xs" | "sm" | "md" | "lg" = "lg";

  public modalOpened$: Observable<boolean>;

  constructor(private readonly modalService: ModalService) {}

  ngOnInit() {
    this.modalOpened$ = this.modalService.getModalState(this.modalName);
  }

  public closeModal() {
    this.modalService.toggleModal(this.modalName, false);
  }

  public saveData() {
    this.closeModal();
  }

  public getModalSize(): ModalDimensions {
    const screenWidth = window.innerWidth;
    let modalSize: ModalDimensions;

    switch (this.size) {
      case "xs":
        modalSize = {
          size: "xs",
          width: "24%",
          maxHeight: "250px",
          height: "48%",
        };
        break;
      case "sm":
        modalSize = {
          size: "sm",
          width: "36%",
          maxHeight: "350px",
          height: "72%",
        };
        break;
      case "md":
        modalSize = {
          size: "md",
          width: "48%",
          maxHeight: "400px",
          height: "84%",
        };
        break;
      case "lg":
        modalSize = {
          size: "lg",
          width: "80%",
          maxHeight: "85%",
          height: "96%",
        };
        break;
      default:
        if (screenWidth >= 1584) {
          modalSize = { size: "lg", width: "72%", height: "96%" };
        } else if (screenWidth >= 1312) {
          modalSize = { size: "md", width: "60%", height: "84%" };
        } else if (screenWidth >= 1056) {
          modalSize = { size: "sm", width: "48%", height: "72%" };
        } else {
          modalSize = { size: "xs", width: "24%", height: "48%" };
        }
        break;
    }

    return modalSize;
  }

  protected trackByFn(index: number): number {
    return index;
  }
}
