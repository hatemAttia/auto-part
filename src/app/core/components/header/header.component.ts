import { Component, OnInit, HostListener } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule, NgClass } from "@angular/common";
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
    RouterLinkActive,
    NgClass,
    FormsModule,
    ButtonModule,
    MenubarModule,
    BadgeModule,
    TooltipModule,
    InputTextModule,
  ],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any;
  cartItemCount = 0;
  cartTotal = 0;
  menuItems: MenuItem[] = [];
  searchTerm = "";
  mobileMenuOpen = false;
  isMobileView = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private searchService: SearchService,
    private router: Router
  ) {
    this.checkScreenSize();
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth < 768;
    if (!this.isMobileView) {
      this.mobileMenuOpen = false;
    }
  }

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
    this.searchService.searchTerm$.subscribe((term) => {
      this.searchTerm = term;
    });
  }

  updateMenuItems(): void {
    if (this.isLoggedIn) {
      this.menuItems = [
        // Mobile menu items can go here if needed
      ];
    } else {
      this.menuItems = [];
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  goToCart(): void {
    this.router.navigate(["/private/cart"]);
    this.closeMobileMenu();
  }

  search(): void {
    console.log("Searching for:", this.searchTerm);

    if (this.searchTerm.trim()) {
      this.searchService.updateSearchTerm(this.searchTerm);
      // Navigate to the search page if we're not already there
      if (!this.router.url.includes("/private/search")) {
        this.router.navigate(["/private/search"]);
      }
      this.closeMobileMenu();
    }
  }

  formatPrice(price: number): string {
    // make it a string with 3 digits after the decimal point and a 'dt' at the end
    return price.toFixed(3) + " dt";
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
