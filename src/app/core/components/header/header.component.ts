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
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
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
        // {
        //   label: "My Cart",
        //   icon: "pi pi-shopping-cart",
        //   routerLink: "/cart",
        //   badge: this.cartItemCount.toString(),
        //   visible: this.cartItemCount > 0,
        // },
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
