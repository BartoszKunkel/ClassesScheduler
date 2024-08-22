import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Data } from '../../../Data/Data';
import { HEROES } from '../../../Mock/mock-heroes';


@Component({
  selector: 'app-hidden-drop-down-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './hidden-drop-down-list.component.html',
  styleUrl: './hidden-drop-down-list.component.scss'
})
export class HiddenDropDownListComponent {
data: Data[];
inputValue: string = "";
returnId: number;

formGroup: FormGroup = new FormGroup({
  formGroup: new FormControl('')
});

ngOnInit()
{
  if(this.data == null){
  this.data = HEROES;}
}


showDropDown(): void
{
  document.getElementById("myDropdown").classList.toggle("show");
}

onKey(event: any)
{
  let input;
  input = document.getElementById("dropInput");
  this.data = this.filterDropDownList(event.target.value);
  if(event.target.value == ''){
    this.getHeroes();
  }

}

filterDropDownList(value: string)
{
  let filter = value.toUpperCase();
  return this.data.filter((option: any) => option.content.toUpperCase().includes(filter));
}

getHeroes(): void
{
  this.data = HEROES;
}



fill(id: number, content: string)
{
 this.inputValue = content;
 this.returnId = id;
}

protected trackByFn(index: number): number {
  return index;
}

}
