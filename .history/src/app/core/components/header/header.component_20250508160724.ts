import { Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { MenubarModule } from "primeng/menubar";
import { BadgeModule } from "primeng/badge";
import { TooltipModule } from "primeng/tooltip";
import { MenuItem } from "primeng/api";
import { AuthService } from "../../services/auth.service";
import { CartService } from "../../services/cart.service";
import { User } from "../../../shared/models/user.model";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, MenubarModule, BadgeModule, TooltipModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo" [routerLink]="isLoggedIn ? '/search' : '/login'">
            <span class="logo-text">AutoParts<span class="highlight">B2B</span></span>
          </div>

          <div class="nav-actions" *ngIf="isLoggedIn">
            <p-menubar [model]="menuItems" class="nav-menu">
              <ng-template pTemplate="end">
                <div class="user-section">
                  <button
                    pButton
                    icon="pi pi-shopping-cart"
                    class="p-button-rounded p-button-text cart-button"
                    [routerLink]="'/cart'"
                    pTooltip="View Cart"
                  >
                    <span class="p-badge p-badge-danger" *ngIf="cartItemCount > 0">{{
                      cartItemCount
                    }}</span>
                  </button>

                  <span class="user-info">
                    <span class="user-name"
                      >{{ currentUser?.firstName }} {{ currentUser?.lastName }}</span
                    >
                    <span class="user-company">{{ currentUser?.company }}</span>
                  </span>

                  <button
                    pButton
                    icon="pi pi-sign-out"
                    class="p-button-rounded p-button-text"
                    (click)="logout()"
                    pTooltip="Logout"
                  ></button>
                </div>
              </ng-template>
            </p-menubar>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        background-color: var(--primary-color);
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-sm) 0;
      }

      .logo {
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      .logo:hover {
        transform: scale(1.05);
      }

      .logo-text {
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .highlight {
        color: var(--accent-light);
      }

      .nav-menu {
        background: transparent;
        border: none;
        padding: 0;
      }

      .nav-menu ::ng-deep .p-menubar-root-list {
        margin-right: var(--spacing-lg);
      }

      .nav-menu ::ng-deep .p-menubar-root-list > .p-menuitem > .p-menuitem-link {
        color: white;
      }

      .nav-menu ::ng-deep .p-menubar-root-list > .p-menuitem > .p-menuitem-link:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .user-section {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .user-info {
        display: flex;
        flex-direction: column;

        text-align: right;
        margin-right: var(--spacing-xs);
      }

      .user-name {
        font-weight: 600;
        color: black;
      }

      .user-company {
        color: black;

        font-size: 0.8rem;
        //        color: rgba(255, 255, 255, 0.8);
      }

      .cart-button {
        position: relative;
      }

      ::ng-deep .p-badge {
        position: absolute;
        top: -5px;
        right: -5px;
      }

      @media screen and (max-width: 768px) {
        .header-content {
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .user-info {
          display: none;
        }
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;
  cartItemCount = 0;
  menuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      this.updateMenuItems();
    });

    this.cartService.getItemCount().subscribe((count) => {
      this.cartItemCount = count;
    });
  }

  updateMenuItems(): void {
    if (this.isLoggedIn) {
      this.menuItems = [
        // {
        //   label: "Search Parts",
        //   icon: "pi pi-search",
        //   routerLink: "/search",
        // },
        {
          label: "My Cart",
          icon: "pi pi-shopping-cart",
          routerLink: "/cart",
          badge: this.cartItemCount.toString(),
          visible: this.cartItemCount > 0,
        },
      ];
    } else {
      this.menuItems = [];
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
