import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { Data } from "../../../Data/Data";
import { DataService } from "../../../Services/data.service";
import { DropdownService } from "./dropdown.service";

@Component({
  selector: "app-dropdown-list",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./dropdown-list.component.html",
  styleUrl: "./dropdown-list.component.scss",
})
export class DropDownListComponent implements OnChanges {
  @Input() public data: Data[] = [];
  @Input() public classesUpdateData: Data;
  @Input() public type = -1;
  @Input() public clear = false;
  @Input() public label: string;
  @Output() public onChoose = new EventEmitter();
  @Output() public returnId: number;

  public dataCopy: Data[] = [];
  public isOpen = false;
  public inputValue = "";
  public disabled = false;
 
  private _subscription = new Subscription();

  constructor(
    private elementRef: ElementRef,
    private dataService: DataService,
    private dropDownService: DropdownService,
  ) {
    this._subscription.add(this.dataService.disableEmitter.subscribe(
      (data: boolean) => {
        this.disabled = data;
      },
    ));
    this._subscription.add(this.dropDownService.emitter.subscribe(response =>{
      if(response['trigger'] == true){

        this.fillAndSend(response['id'], response['content']);
      }
  }));
    this._subscription.add(this.dropDownService.clearEmmiter.subscribe(
      (received: boolean) =>{
        if(received){
          this.clearFields();
        }
      }
    ))
  }

  ngOnDestroy(){
    this._subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"]) {
      this.dataCopy = [...this.data];  
    }

    if (changes["clear"] && this.clear) {
      this.clearFields();
    }

    if (changes["classesUpdateData"]){
      if(this.classesUpdateData != undefined){
      this.fillAndSend(this.classesUpdateData.id, this.classesUpdateData.content);
      }}
  }

  public clearFields(): void {
    this.inputValue = "";
    this.returnId = null;
    this.clear = false;
    this.dataCopy = [...this.data];
  }

  @HostListener("document:click", ["$event"])
  public clickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  public onKey(event: any): void {
    this.isOpen = true;
    const filterValue = event.target.value.trim().toLowerCase();
  
    const filterWords = filterValue.split(" ");
    
    const normalizedFilterWords = filterWords.map(word =>
      word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );
    
    this.dataCopy = this.data.filter((option: Data) => {
      const normalizedContent = option.content.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normalizedFilterWords.every(word =>
        normalizedContent.includes(word)
      );
    });
  }

  public toggleDropDown(): void {
    this.isOpen = !this.isOpen;
  }

  public fillAndSend(id: number, content: string): void {
    this.inputValue = content;
    this.returnId = id;
    this.emitChooseEvent();
  }

  protected trackByFn(index: number): number {
    return index;
  }

  private emitChooseEvent(): void {
    if (this.type === 0) {
      this.onChoose.emit(this.returnId);
    } else {
      
      this.onChoose.emit(this.inputValue);
    }

    this.isOpen = false;
  }
}
