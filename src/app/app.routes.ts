import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { BaseComponent } from "./features/base/base.component";

export const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "private",
    component: BaseComponent,
    children: [
      {
        path: "home",
        loadComponent: () =>
          import("./features/landing-page/landing-page.component").then(
            (m) => m.LandingPageComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: "search",
        loadComponent: () =>
          import("./features/search/search-landing/search-landing.component").then(
            (m) => m.SearchLandingComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: "part",
        loadComponent: () =>
          import("./features/search/part-detail/part-detail.component").then(
            (m) => m.PartDetailComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: "documents",
        loadComponent: () =>
          import("./features/management/documents-management/documents-management.component").then(
            (m) => m.DocumentsManagementComponent
          ),
        canActivate: [authGuard],
        children: []
      },
      {
        path: "documents/:type",
        loadComponent: () =>
          import("./features/management/documents-management/documents-management.component").then(
            (m) => m.DocumentsManagementComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: "equivalents",
        loadComponent: () =>
          import("./features/search/part-equivalent/part-equivalent.component").then(
            (m) => m.PartEquivalentComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: "cart",
        loadComponent: () =>
          import("./features/cart/cart-page/cart-page.component").then((m) => m.CartPageComponent),
        canActivate: [authGuard],
      },
      {
        path: "**",
        redirectTo: "/search",
      },
    ],
  },
];
