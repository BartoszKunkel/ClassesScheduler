import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgbAlert, NgbAlertModule } from "@ng-bootstrap/ng-bootstrap";
import { debounceTime, Observable, Subject, Subscription, tap } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-alert",
  standalone: true,
  imports: [NgbAlertModule, CommonModule],
  templateUrl: "./alert.component.html",
  styleUrl: "./alert.component.scss",
})
export class AlertComponent implements OnInit, OnDestroy {
  public staticAlertClosed = false;
  public successMessage = "";
  public warningMessage = "";
  public errorMessage = "";
  public staticErrorMessage = "";
  @ViewChild("staticAlert", { static: false }) protected staticAlert: NgbAlert;
  @ViewChild("selfClosingAlert", { static: false })
  protected selfClosingAlert: NgbAlert;
  @ViewChild("selfClosingWarningAlert", { static: false })
  protected selfClosingWarningAlert: NgbAlert;
  @ViewChild("selfClosingErrorAlert", { static: false })
  protected selfClosingErrorAlert: NgbAlert;
  private readonly _successMessage$ = new Subject<string>();
  private readonly _warningMessage$ = new Subject<string>();
  private readonly _errorMessage$ = new Subject<string>();
  private readonly _staticErrorMessage$ = new Subject<string>();
  private _subscriptions = new Subscription();

  constructor() {}

  ngOnInit() {
    this.subscribeToMessage(this._successMessage$, (message) => {
      this.successMessage = message;
      this.selfClosingAlert?.close();
    });

    this.subscribeToMessage(this._warningMessage$, (message) => {
      this.warningMessage = message;
      this.selfClosingWarningAlert?.close();
    });

    this.subscribeToMessage(this._errorMessage$, (message) => {
      this.errorMessage = message;
      this.selfClosingErrorAlert?.close();
    });

    this.subscribeToMessage(this._staticErrorMessage$, (message) => {
      this.staticErrorMessage = message;
      this.staticAlert?.close();
    });
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  public changeSuccessMessage(msg: string) {
    this._successMessage$.next(msg);
  }

  public changeWarningMessage(msg: string) {
    this._warningMessage$.next(msg);
  }

  public changeErrorMessage(msg: string) {
    this._errorMessage$.next(msg);
  }

  public changeStaticErrorMessage(msg: string) {
    this._staticErrorMessage$.next(msg);
  }

  private subscribeToMessage(
    message$: Observable<string>,
    action: (message: string) => void,
  ): void {
    this._subscriptions.add(
      message$.pipe(tap(action), debounceTime(7000)).subscribe(),
    );
  }
}
