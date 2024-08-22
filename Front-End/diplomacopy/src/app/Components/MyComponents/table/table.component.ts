import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { Observable } from "rxjs";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

export interface TableConfig {
  headers: string[];
  data$: Observable<any>;
  attributes: string[];
  actionsColumn: boolean;
  caption: string;
  onView?: (id: number) => any;
  onEdit?: (id: number) => any;
  onDelete?: (id: number) => any;
}

@Component({
  selector: "app-table",
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, NgbDropdownModule],
  templateUrl: "./table.component.html",
  styleUrl: "./table.component.scss",
})
export class TableComponent {
  @Input() tableConfig: TableConfig;
  @Output() currentActionID = new EventEmitter();

  public emit(actionID: any): void {
    this.currentActionID.emit(actionID);
  }
}
