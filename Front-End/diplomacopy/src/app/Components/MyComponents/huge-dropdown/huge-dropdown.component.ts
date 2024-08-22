import { Component, Input } from "@angular/core";
import { NgClass, NgIf } from "@angular/common";
import { DropdownService } from "../dropdown-list/dropdown.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-huge-dropdown",
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: "./huge-dropdown.component.html",
  styleUrl: "./huge-dropdown.component.scss",
})
export class HugeDropdownComponent {
  @Input() public label = "Label";
  public isOpen = false;
  subscription: Subscription;

  constructor(private dropdownService: DropdownService)
  {
    this.subscription =  this.dropdownService.hugeDropdownToggleEmitter.subscribe(
      (data: boolean) => {
      this.isOpen = data;
    })
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }


  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
