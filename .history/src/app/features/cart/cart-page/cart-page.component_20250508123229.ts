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
  template: `
    <div class="container">
      <div class="cart-header">
        <h1>Shopping Cart</h1>
      </div>

      <div class="cart-empty" *ngIf="cartItems.length === 0">
        <p-card>
          <div class="empty-content">
            <i class="pi pi-shopping-cart empty-icon"></i>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any parts to your cart yet.</p>
            <button
              pButton
              label="Browse Parts"
              icon="pi pi-search"
              [routerLink]="['/search']"
            ></button>
          </div>
        </p-card>
      </div>

      <div class="cart-content" *ngIf="cartItems.length > 0">
        <div class="cart-table-section">
          <p-card>
            <p-table
              [value]="cartItems"
              [tableStyle]="{ 'min-width': '50rem' }"
              dataKey="part.id"
              styleClass="cart-table"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-item>
                <tr>
                  <td>
                    <div class="item-details">
                      <img
                        [src]="item.part.imageUrl"
                        [alt]="item.part.name"
                        class="item-thumbnail"
                        (click)="viewItemDetails(item.part.id)"
                      />
                      <div class="item-info" (click)="viewItemDetails(item.part.id)">
                        <span class="item-name">{{ item.part.name }}</span>
                        <span class="item-part-number">{{ item.part.partNumber }}</span>
                        <span class="item-provider">{{ item.part.provider.name }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="price-column">\${{ item.part.price.toFixed(2) }}</td>
                  <td class="quantity-column">
                    <p-inputNumber
                      [(ngModel)]="item.quantity"
                      [showButtons]="true"
                      buttonLayout="horizontal"
                      [min]="1"
                      [max]="item.part.stock"
                      style="{ width: '100px !important'}"
                      [disabled]="item.part.stock === 0"
                      (onInput)="updateQuantity(item.part.id, item.quantity)"
                      styleClass="p-inputnumber-sm"
                    ></p-inputNumber>
                  </td>
                  <td class="total-column">\${{ (item.part.price * item.quantity).toFixed(2) }}</td>
                  <td class="action-column">
                    <button
                      pButton
                      icon="pi pi-trash"
                      class="p-button-rounded p-button-text p-button-danger"
                      (click)="removeItem(item.part.id)"
                      pTooltip="Remove Item"
                    ></button>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>

          <div class="cart-actions">
            <button
              pButton
              label="Continue Shopping"
              icon="pi pi-arrow-left"
              class="p-button-outlined p-button-secondary"
              [routerLink]="['/search']"
            ></button>
            <button
              pButton
              label="Clear Cart"
              icon="pi pi-trash"
              class="p-button-outlined p-button-danger"
              (click)="confirmClearCart()"
            ></button>
          </div>
        </div>

        <div class="cart-summary-section">
          <p-card header="Order Summary" styleClass="order-summary-card">
            <div class="summary-content">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>\${{ cartTotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              <div class="summary-row">
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>

              <p-divider></p-divider>

              <div class="summary-row total-row">
                <span>Total:</span>
                <span>\${{ cartTotal.toFixed(2) }}</span>
              </div>

              <button
                pButton
                label="Proceed to Checkout"
                icon="pi pi-check"
                class="p-button-primary checkout-button"
                (click)="checkout()"
              ></button>

              <div class="summary-info">
                <p>
                  <i class="pi pi-info-circle"></i> This is a demo application. No actual payments
                  will be processed.
                </p>
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>

    <p-toast position="bottom-right"></p-toast>

    <p-confirmDialog
      header="Confirm Clear Cart"
      icon="pi pi-exclamation-triangle"
      [style]="{ width: '450px' }"
      acceptButtonStyleClass="p-button-danger"
      rejectButtonStyleClass="p-button-text"
    ></p-confirmDialog>

    <p-dialog
      [(visible)]="checkoutDialog"
      header="Checkout Information"
      [style]="{ width: '450px' }"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
    >
      <div class="dialog-content">
        <i class="pi pi-info-circle info-icon"></i>
        <div class="dialog-message">
          <h3>This is a Demo Application</h3>
          <p>
            In a real-world application, this would proceed to a secure checkout process where you
            could enter shipping details and payment information.
          </p>
          <p>For this demo, we'll simulate a successful order placement.</p>
        </div>
      </div>
      <div class="dialog-actions">
        <button
          pButton
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          (click)="checkoutDialog = false"
        ></button>
        <button
          pButton
          label="Place Order"
          icon="pi pi-check"
          class="p-button-primary"
          (click)="placeOrder()"
        ></button>
      </div>
    </p-dialog>

    <p-dialog
      [(visible)]="orderPlacedDialog"
      header="Order Placed Successfully"
      [style]="{ width: '450px' }"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [closable]="false"
    >
      <div class="dialog-content">
        <i class="pi pi-check-circle success-icon"></i>
        <div class="dialog-message">
          <h3>Thank You for Your Order!</h3>
          <p>Your order has been placed successfully.</p>
          <p>
            Order Reference: <strong>#{{ orderReference }}</strong>
          </p>
        </div>
      </div>
      <div class="dialog-actions">
        <button
          pButton
          label="Continue Shopping"
          icon="pi pi-shopping-cart"
          class="p-button-primary"
          (click)="finishOrder()"
        ></button>
      </div>
    </p-dialog>
  `,
  styles: [
    `
      .cart-header {
        margin-bottom: var(--spacing-lg);
      }

      .cart-header h1 {
        color: var(--primary-color);
      }

      .cart-content {
        display: flex;
        gap: var(--spacing-lg);
      }

      .cart-table-section {
        flex: 3;
      }

      .cart-summary-section {
        flex: 1;
        min-width: 300px;
      }

      .cart-table ::ng-deep .p-datatable-wrapper {
        border-radius: 8px;
        overflow: hidden;
      }

      .item-details {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .item-thumbnail {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
      }

      .item-info {
        display: flex;
        flex-direction: column;
        cursor: pointer;
      }

      .item-name {
        font-weight: 600;
        color: var(--neutral-900);
      }

      .item-part-number,
      .item-provider {
        font-size: 0.85rem;
        color: var(--neutral-600);
      }

      .price-column,
      .total-column {
        font-weight: 600;
        color: var(--neutral-800);
      }

      .total-column {
        color: var(--primary-color);
      }

      .cart-actions {
        display: flex;
        justify-content: space-between;
        margin-top: var(--spacing-md);
      }

      .order-summary-card {
        height: 100%;
      }

      .summary-content {
        display: flex;
        flex-direction: column;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--spacing-sm);
      }

      .total-row {
        font-weight: 700;
        font-size: 1.2rem;
        color: var(--primary-color);
      }

      .checkout-button {
        margin-top: var(--spacing-md);
        width: 100%;
      }

      .summary-info {
        margin-top: var(--spacing-md);
        font-size: 0.85rem;
        color: var(--neutral-600);
        font-style: italic;
      }

      .summary-info p {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .cart-empty {
        text-align: center;
      }

      .empty-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--spacing-xl) 0;
      }

      .empty-icon {
        font-size: 3rem;
        color: var(--neutral-400);
        margin-bottom: var(--spacing-md);
      }

      .dialog-content {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-md);
        padding: var(--spacing-md) 0;
      }

      .info-icon {
        font-size: 2rem;
        color: var(--primary-color);
      }

      .success-icon {
        font-size: 2rem;
        color: var(--success-color);
      }

      .dialog-message h3 {
        margin: 0 0 var(--spacing-xs) 0;
        color: var(--neutral-900);
      }

      .dialog-message p {
        margin: var(--spacing-xs) 0;
        color: var(--neutral-700);
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-md);
      }

      @media screen and (max-width: 992px) {
        .cart-content {
          flex-direction: column;
        }

        .cart-summary-section {
          min-width: 100%;
        }
      }

      @media screen and (max-width: 768px) {
        .item-details {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-xs);
        }

        .item-thumbnail {
          width: 80px;
          height: 80px;
        }
      }
    `,
  ],
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
