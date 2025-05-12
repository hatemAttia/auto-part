import { Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { MenubarModule } from "primeng/menubar";
import { BadgeModule } from "primeng/badge";
import { TooltipModule } from "primeng/tooltip";
import { InputTextModule } from "primeng/inputtext";
import { MenuItem } from "primeng/api";
import { AuthService } from "../../services/auth.service";
import { CartService } from "../../services/cart.service";
import { SearchService } from "../../services/search.service";
import { User } from "../../../shared/models/user.model";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule,
    ButtonModule, 
    MenubarModule, 
    BadgeModule, 
    TooltipModule,
    InputTextModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;
  cartItemCount = 0;
  cartTotal = 0;
  menuItems: MenuItem[] = [];
  searchTerm = '';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private searchService: SearchService,
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

    this.cartService.getTotalPrice().subscribe((total) => {
      this.cartTotal = total;
    });

    // Subscribe to search service to keep the search bar in sync
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
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

  search(): void {
    this.searchService.updateSearchTerm(this.searchTerm);
    // Navigate to the search page if we're not already there
    if (!this.router.url.includes('/search')) {
      this.router.navigate(['/search']);
    }
  }

  formatPrice(price: number): string {
    // make it a string with 3 digits after the decimal point and a 'dt' at the end
    return price.toFixed(3) + ' dt';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
