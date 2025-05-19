import { Component } from "@angular/core";
import { Part } from "../../../shared/models/part.model";
import { PartsService } from "../../../core/services/parts.service";
import { CommonModule } from "@angular/common";
import { InputNumberModule } from "primeng/inputnumber";
import { CartService } from "../../../core/services/cart.service";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CarouselModule } from "primeng/carousel";
import { PartCardComponent } from "../part-card/part-card.component";

@Component({
  selector: "app-part-equivalent",
  imports: [
    CommonModule,
    InputNumberModule,
    FormsModule,
    ButtonModule,
    CarouselModule,
    PartCardComponent,
  ],
  templateUrl: "./part-equivalent.component.html",
  styleUrl: "./part-equivalent.component.scss",
})
export class PartEquivalentComponent {
  constructor(private partsService: PartsService, private cartService: CartService) {}

  equivalentParts!: Part[] | null;
  quantityMap: Map<string, number> = new Map();
  quantity: number = 1;
  addedToCartDialog: boolean = false;

  part: Part | undefined;

  // Carousel responsive options
  responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 5,
      numScroll: 3,
    },
    {
      breakpoint: "1024px",
      numVisible: 4,
      numScroll: 2,
    },
    {
      breakpoint: "768px",
      numVisible: 3,
      numScroll: 1,
    },
  ];

  ngOnInit() {
    this.loadPartDetails("1");
  }

  getEquivalentParts(id: string) {
    this.partsService.getEquivalentParts(id).subscribe(
      (response: Part[]) => {
        this.equivalentParts = [...response, ...response, ...response];
        // Initialize quantities for each part

        this.equivalentParts.forEach((part) => {
          this.quantityMap.set(part.id, 1);
        });
      },
      (error) => {
        console.error("Error fetching equivalent parts:", error);
      }
    );
  }

  loadPartDetails(partId: string): void {
    this.partsService.getPartById(partId).subscribe(
      (part: Part | undefined) => {
        this.part = part;
        if (part) {
          this.getEquivalentParts(part.id);
        }
      },
      (error) => {
        console.error("Error fetching part details:", error);
      }
    );
  }

  addToCart(quantity: number): void {
    if (this.part && quantity > 0) {
      this.cartService.addToCart(this.part, quantity);
      this.quantity = quantity; // Save quantity for dialog
      this.addedToCartDialog = true;
    }
  }

  getQuantity(partId: string): number {
    return this.quantityMap.get(partId) || 1;
  }

  // Set quantity for a specific part
  setQuantity(partId: string, quantity: number): void {
    this.quantityMap.set(partId, quantity);
  }
  formatPrice(price: number): string {
    // make it a string with 3 digits after the decimal point and a 'dt' at the end
    return price.toFixed(3) + " TND";
  }

  getStockStatusClass(): string {
    if (!this.part) return "";
    return this.part.stock > 0 ? "dot-available" : "dot-unavailable";
  }

  getStockStatusText(): string {
    if (!this.part) return "";
    return this.part.stock > 0 ? "En stock" : "Non disponible";
  }

  onViewDetails(part: Part): void {
    // Navigate to part details
    console.log("View details for part:", part);
    // Implement navigation logic here
  }

  onAddToCart(part: Part): void {
    // Add the part to the cart with quantity 1
    this.cartService.addToCart(part, 1);
    console.log("Added to cart:", part);
  }
}
