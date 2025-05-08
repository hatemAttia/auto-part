import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { CartService } from "../../../core/services/cart.service";
import { CartItem } from "../../../shared/models/cart-item.model";

@Component({
  selector: "app-cart-page",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TableModule,
    ButtonModule,
    InputNumberModule,
    CardModule,
    DividerModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  checkoutDialog = false;
  orderPlacedDialog = false;
  orderReference = "";

  constructor(
    private cartService: CartService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });

    this.cartService.cartTotal$.subscribe((total) => {
      this.cartTotal = total;
    });
  }

  updateQuantity(partId: string, quantity: number): void {
    this.cartService.updateQuantity(partId, quantity);
  }

  removeItem(partId: string): void {
    this.cartService.removeFromCart(partId);
    this.messageService.add({
      severity: "success",
      summary: "Item Removed",
      detail: "Item has been removed from your cart.",
    });
  }

  confirmClearCart(): void {
    this.confirmationService.confirm({
      message: "Are you sure you want to remove all items from your cart?",
      accept: () => {
        this.cartService.clearCart();
        this.messageService.add({
          severity: "success",
          summary: "Cart Cleared",
          detail: "All items have been removed from your cart.",
        });
      },
    });
  }

  viewItemDetails(partId: string): void {
    this.router.navigate(["/part", partId]);
  }

  checkout(): void {
    this.checkoutDialog = true;
  }

  placeOrder(): void {
    this.checkoutDialog = false;

    // Generate mock order reference
    this.orderReference = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    // Show order success dialog
    setTimeout(() => {
      this.orderPlacedDialog = true;
    }, 800);
  }

  finishOrder(): void {
    this.orderPlacedDialog = false;
    this.cartService.clearCart();
    this.router.navigate(["/search"]);
  }
}
