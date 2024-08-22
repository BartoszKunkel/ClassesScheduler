import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpService } from "../../../Services/http.service";
import { RadioComponent } from "../../Bootstrap/radio/radio.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-classes-add-form",
  standalone: true,
  imports: [
    RadioComponent,
    NgbModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./classes-add-form.component.html",
  styleUrl: "./classes-add-form.component.scss",
})
export class ClassesAddFormComponent implements OnInit, OnDestroy {
  classesForm: FormGroup;
  private _subscriptions = new Subscription();

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.classesForm = new FormGroup({
      majorid: new FormControl<BigInt>(null, [Validators.required]),
      subjectid: new FormControl<BigInt>(null, [Validators.required]),
    });
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  submit(): void {
    const dataToSend = {
      majorid: this.classesForm.get("majorid").value,
      subjectid: this.classesForm.get("subjectid").value,
      roomid: this.classesForm.get("roomid").value,
      teacherid: this.classesForm.get("teacherid").value,
      start_time: this.classesForm.get("start_time").value,
      end_time: this.classesForm.get("end_time").value,
    };

    if (this.classesForm.get("majorid").valid)
      console.log(this.classesForm.get("majorid").value);

    if (this.classesForm.valid) {
      console.log(dataToSend);

      this._subscriptions.add(
        this.httpService.postClasses(dataToSend).subscribe({
          next: (response) => {
            console.log("Response:", response);
          },
          error: (error) => {
            console.error("Error:", error);
          },
        }),
      );
    }
  }

  getClasses() {
    this._subscriptions.add(
      this.httpService.getClasses().subscribe((data) => {
        console.log(data);
      }),
    );
  }
}
