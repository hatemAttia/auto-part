import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { ButtonResizeDirective } from "../../directive/button-resize.directive";
import { TagModule } from "primeng/tag";

@Component({
  selector: "app-add-to-cart",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    ButtonModule,
    ButtonResizeDirective,
    TagModule,
  ],
  templateUrl: "./add-to-cart.component.html",
  styleUrls: ["./add-to-cart.component.scss"],
})
export class AddToCartComponent {
  @Input() stock: number = 0;
  @Input() price: number = 0;
  @Input() priceSize: "small" | "medium" | "large" = "medium";
  @Input() isAvailable: boolean = true;
  @Input() availabilitySize: "small" | "medium" | "large" = "medium";
  @Input() showLabel: boolean = true;
  @Input() showIcon: boolean = true;
  @Input() showAvailibility = true;
  @Input() availabilityMode: "badge" | "text" = "badge";

  @Output() getQuantity = new EventEmitter<number>();

  quantity: number = 1;

  getStockStatusClass(): string {
    return this.isAvailable ? "dot-available" : "dot-unavailable";
  }
  getStockStatusText(): string {
    return this.isAvailable ? "En stock" : "Non disponible";
  }

  formatPrice(price: number): string {
    return price.toFixed(3) + " TND";
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  incrementQuantity(): void {
    if (this.quantity < this.stock) {
      this.quantity++;
    }
  }

  validateQuantity(): void {
    // Ensure quantity stays within bounds
    if (this.quantity < 1) {
      this.quantity = 1;
    } else if (this.quantity > this.stock) {
      this.quantity = this.stock;
    }
  }

  onAddQuantity(): void {
    if (this.quantity > 0) {
      this.getQuantity.emit(this.quantity);
    }
  }
}
