import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-add-to-cart",
  standalone: true,
  imports: [CommonModule, FormsModule, InputNumberModule, ButtonModule],
  templateUrl: "./add-to-cart.component.html",
  styleUrls: ["./add-to-cart.component.scss"],
})
export class AddToCartComponent {
  @Input() stock: number = 0;
  @Input() price: number = 0;
  @Input() priceSize: "small" | "medium" | "large" = "medium";
  @Input() isAvailable: boolean = true;

  @Output() getQuantity = new EventEmitter<number>();

  quantity: number = 1;

  getStockStatusClass(): string {
    return this.isAvailable ? "dot-available" : "dot-unavailable";
  }
  

  getStockStatusText(): string {
    return this.isAvailable ? "En stock" : "Épuisé";
  }

  formatPrice(price: number): string {
    return price.toFixed(3) + " TND";
  }

  onAddQuantity(): void {
    if (this.quantity > 0) {
      this.getQuantity.emit(this.quantity);
    }
  }
}
