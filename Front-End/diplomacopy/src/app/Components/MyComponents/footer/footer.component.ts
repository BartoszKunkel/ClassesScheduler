import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  public currentYear: number;
  public isOpen = false;

  ngOnInit(): void {
    this.getCurrentYear();
  }

  public getCurrentYear() {
    const date = new Date();
    this.currentYear = date.getFullYear();
  }

  public toggleFooter(): void {
    this.isOpen = !this.isOpen;
  }
}
