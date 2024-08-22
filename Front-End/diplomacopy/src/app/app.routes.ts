import { Routes } from "@angular/router";
import { authGuard } from "./Auth/AuthGuard/auth-guard.guard";
import { authHighGuard } from "./Auth/AuthGuard/auth-high-guard.guard";
import { authLowGuard } from "./Auth/AuthGuard/auth-low-guard.guard";
import { authMediumGuard } from "./Auth/AuthGuard/auth-medium-guard.guard";
export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "kalendarz",
  },
  {
    path: "autoryzacja",
    loadComponent: () =>
      import("./Views/view-auth/view-auth.component").then(
        (c) => c.ViewAuthComponent,
      ),
  },
  {
    path: "kalendarz",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./Views/view-calendar/view-calendar.component").then(
        (c) => c.ViewCalendarComponent,
      ),
  },
  {
    path: "kierunki",
    canActivate: [authLowGuard],
    loadComponent: () =>
      import("./Views/view-majors/view-majors.component").then(
        (c) => c.ViewMajorsComponent,
      ),
  },
  {
    path: "pokoje",
    canActivate: [authLowGuard],
    loadComponent: () =>
      import("./Views/view-rooms/view-rooms.component").then(
        (c) => c.ViewRoomsComponent,
      ),
  },
  {
    path: "przedmioty",
    canActivate: [authLowGuard],
    loadComponent: () =>
    import("./Views/view-subjets/view-subjets.component").then(
      (c) => c.ViewSubjetsComponent,
    ),
  },
  {
    path: "prowadzacy",
    canActivate: [authLowGuard],
    loadComponent:() =>
    import("./Views/view-teachers/view-teachers.component").then(
      (c) => c.ViewTeachersComponent,
    ),
  },
  {
    path: "zajecia",
    canActivate: [authLowGuard],
    loadComponent:() =>
    import("./Views/view-classes/view-classes.component").then(
      (c) => c.ViewClassesComponent,
    )
  },
  {
    path: "zajeciaokresowe",
    canActivate: [authHighGuard],
    loadComponent:() =>
    import("./Views/view-periodic-classes/view-periodic-classes.component").then(
      (c) => c.ViewPeriodicClassesComponent,
    )
  },
  {
    path: "rejestracja",
    canActivate: [authHighGuard],
    loadComponent:() =>
    import("./Views/view-register/view-register.component").then(
     (c) => c.ViewRegisterComponent,
    )
  },
  {
    path: "**",
    redirectTo: "kalendarz",
  },
];
