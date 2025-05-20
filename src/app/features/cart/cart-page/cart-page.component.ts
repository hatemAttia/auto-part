import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, Optional } from "@angular/core";
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
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CartService } from "../../../core/services/cart.service";
import { CartItem } from "../../../shared/models/cart-item.model";
import { formatPrice } from "../../../core/utils/format.utils";

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
  templateUrl: "./cart-page.component.html",
  styleUrls: ["./cart-page.component.scss"],
})
export class CartPageComponent implements OnInit, OnChanges {
  // No longer needed as input property since we'll get it from DynamicDialogConfig
  mode: 'cart' | 'orderDetails' = 'cart';
  
  // These will still be used when in orderDetails mode
  orderItems: CartItem[] = [];
  orderTotal: number = 0;
  orderProcessed: boolean = false;
  
  @Output() orderChanged = new EventEmitter<CartItem[]>();
  
  cartItems: CartItem[] = [];
  cartTotal = 0;
  checkoutDialog = false;
  orderPlacedDialog = false;
  orderReference = "";
  hasChanges = false;  constructor(
    private cartService: CartService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    // Make these dependencies optional with @Optional()
    @Optional() public dialogRef: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) { }
  ngOnInit(): void {
    // First check if we're in a dialog mode
    if (this.config && this.config.data) {
      this.mode = this.config.data.mode || 'cart';
      this.orderProcessed = this.config.data.orderProcessed || false;
      
      if (this.config.data.orderItems && this.config.data.orderItems.length > 0) {
        this.orderItems = [...this.config.data.orderItems];
        this.orderTotal = this.config.data.orderTotal || 0;
        
        // Create a deep copy for the cart items
        this.cartItems = JSON.parse(JSON.stringify(this.orderItems));
        this.cartTotal = this.orderTotal;
      }
    } else {
      // We're in normal cart mode if there's no config
      this.mode = 'cart';
    }
    
    // Normal cart mode or if no items provided in dialog mode
    if (this.mode === 'cart') {
      this.loadCart();
    } else if (this.mode === 'orderDetails' && (!this.orderItems || this.orderItems.length === 0)) {
      // Fallback to current cart for demo purposes if no items provided
      this.cartService.cartItems$.subscribe(items => {
        this.orderItems = JSON.parse(JSON.stringify(items));
        this.cartItems = JSON.parse(JSON.stringify(items));
      });
      
      this.cartService.cartTotal$.subscribe(total => {
        this.orderTotal = total;
        this.cartTotal = total;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderItems'] && this.mode === 'orderDetails') {
      this.cartItems = JSON.parse(JSON.stringify(this.orderItems)); // Create a deep copy
      this.cartTotal = this.orderTotal;
      this.hasChanges = false;
    }
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
    if (this.mode === 'cart') {
      this.cartService.updateQuantity(partId, quantity);
    } else if (this.mode === 'orderDetails' && !this.orderProcessed) {
      const item = this.cartItems.find(item => item.part.id === partId);
      if (item) {
        item.quantity = quantity;
        this.recalculateTotal();
        this.hasChanges = true;
      }
    }
  }

  recalculateTotal(): void {
    this.cartTotal = this.cartItems.reduce((sum, item) => sum + (item.part.price * item.quantity), 0);
  }

  removeItem(partId: string): void {
    if (this.mode === 'cart') {
      this.cartService.removeFromCart(partId);
      this.messageService.add({
        severity: "success",
        summary: "Article supprimé",
        detail: "L'article a été retiré de votre panier.",
      });
    } else if (this.mode === 'orderDetails' && !this.orderProcessed) {
      this.cartItems = this.cartItems.filter(item => item.part.id !== partId);
      this.recalculateTotal();
      this.hasChanges = true;
    }
  }
  confirmClearCart(): void {
    this.confirmationService.confirm({
      message: "Êtes-vous sûr de vouloir retirer tous les articles de votre panier ?",
      accept: () => {
        this.cartService.clearCart();
        this.messageService.add({
          severity: "success",
          summary: "Panier vidé",
          detail: "Tous les articles ont été retirés de votre panier.",
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
  }  saveOrderChanges(): void {
    if (this.hasChanges) {
      if (this.mode === 'orderDetails' && this.dialogRef) {
        // Return the updated items via dialogRef.close() for DynamicDialog
        this.dialogRef.close({
          items: this.cartItems,
          total: this.cartTotal
        });
      } else {
        // For non-dialog use (rare case, but keeping it for flexibility)
        this.orderChanged.emit(this.cartItems);
      }
      
      this.messageService.add({
        severity: "success",
        summary: "Modifications enregistrées",
        detail: "Les modifications de votre commande ont été enregistrées.",
      });
      this.hasChanges = false;
    }
  }

  finishOrder(): void {
    this.orderPlacedDialog = false;
    this.cartService.clearCart();
    this.router.navigate(["/search"]);
  }

  formatPrice(value: number): string {
    return value.toFixed(3) + ' TND'
  }
}
