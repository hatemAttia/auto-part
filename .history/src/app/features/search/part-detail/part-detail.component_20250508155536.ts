import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { TagModule } from "primeng/tag";
import { ChipModule } from "primeng/chip";
import { ToastModule } from "primeng/toast";
import { RatingModule } from "primeng/rating";
import { MessageService } from "primeng/api";
import { DividerModule } from "primeng/divider";
import { AccordionModule } from "primeng/accordion";
import { DialogModule } from "primeng/dialog";
import { FormsModule } from "@angular/forms";
import { PartsService } from "../../../core/services/parts.service";
import { CartService } from "../../../core/services/cart.service";
import { Part } from "../../../shared/models/part.model";
import { PartCardComponent } from "../part-card/part-card.component";
import { finalize } from "rxjs/operators";
import { forkJoin, of } from "rxjs";

@Component({
  selector: "app-part-detail",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    InputNumberModule,
    ButtonModule,
    CardModule,
    TableModule,
    TabViewModule,
    TagModule,
    ChipModule,
    ToastModule,
    RatingModule,
    DividerModule,
    AccordionModule,
    DialogModule,
    FormsModule,
    PartCardComponent,
  ],
  providers: [MessageService],
  template: `
    <div class="container">
      <div class="breadcrumb">
        <a [routerLink]="['/search']">Search</a> /
        <span *ngIf="part">{{ part.name }}</span>
        <span *ngIf="!part && !isLoading">Part Details</span>
      </div>

      <div class="loading-container" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <p>Loading part details...</p>
      </div>

      <div class="part-not-found" *ngIf="!part && !isLoading">
        <p-card>
          <div class="not-found-content">
            <i class="pi pi-exclamation-triangle not-found-icon"></i>
            <h2>Part Not Found</h2>
            <p>The requested part could not be found or may have been removed.</p>
            <button
              pButton
              label="Return to Search"
              icon="pi pi-search"
              [routerLink]="['/search']"
            ></button>
          </div>
        </p-card>
      </div>

      <div class="part-detail" *ngIf="part && !isLoading">
        <!-- Part Header -->
        <div class="part-header">
          <h1 class="part-title">{{ part.name }}</h1>
          <div class="part-badges">
            <p-tag *ngIf="part.stock > 10" severity="success" value="In Stock"></p-tag>
            <p-tag
              *ngIf="part.stock <= 10 && part.stock > 0"
              severity="warning"
              value="Low Stock"
            ></p-tag>
            <p-tag *ngIf="part.stock === 0" severity="danger" value="Out of Stock"></p-tag>
            <p-tag
              *ngIf="part.replaces.length > 0"
              severity="info"
              value="Replacement Part"
            ></p-tag>
            <p-tag
              *ngIf="part.replacedBy.length > 0"
              severity="info"
              value="Has Newer Replacements"
            ></p-tag>
          </div>
        </div>

        <!-- Main Content -->
        <div class="part-main-content">
          <!-- Left Column - Image and Purchase -->
          <div class="part-image-section">
            <div class="part-image-container">
              <img [src]="part.imageUrl" [alt]="part.name" class="part-image" />
            </div>

            <p-card styleClass="purchase-card">
              <div class="purchase-header">
                <div class="part-number-section">
                  <span class="label">Part Number:</span>
                  <span class="part-number">{{ part.partNumber }}</span>
                </div>
                <div class="part-price-section">
                  <span class="price">\${{ part.price.toFixed(2) }}</span>
                </div>
              </div>

              <div class="provider-section">
                <div class="provider-name">
                  <span class="label">Provider:</span>
                  <span class="value">{{ part.provider.name }}</span>
                </div>
                <div class="provider-rating">
                  <p-rating
                    [ngModel]="part.provider.rating"
                    [readonly]="true"
                    [cancel]="false"
                  ></p-rating>
                  <span class="rating-value">{{ part.provider.rating }}</span>
                </div>
                <div class="delivery-info">
                  <i class="pi pi-truck"></i>
                  <span>{{ part.provider.deliveryTime }}</span>
                </div>
              </div>

              <div
                class="stock-section"
                [ngClass]="{
                  'in-stock': part.stock > 10,
                  'low-stock': part.stock <= 10 && part.stock > 0,
                  'out-of-stock': part.stock === 0
                }"
              >
                <i
                  class="pi"
                  [ngClass]="{
                    'pi-check-circle': part.stock > 0,
                    'pi-times-circle': part.stock === 0
                  }"
                ></i>
                <span>{{ getStockMessage() }}</span>
              </div>

              <div class="purchase-actions">
                <div class="quantity-section">
                  <label for="quantity">Quantity:</label>
                  <p-inputNumber
                    [(ngModel)]="quantity"
                    [showButtons]="true"
                    buttonLayout="horizontal"
                    [min]="1"
                    [max]="part.stock"
                    [style]="{ width: '100px' }"
                    [disabled]="part.stock === 0"
                    inputId="quantity"
                    styleClass="quantity-input"
                    [step]="1"
                  ></p-inputNumber>
                </div>

                <button
                  pButton
                  label="Add to Cart"
                  icon="pi pi-shopping-cart"
                  class="p-button-primary cart-button"
                  [disabled]="part.stock === 0"
                  (click)="addToCart()"
                ></button>
              </div>
            </p-card>
          </div>

          <!-- Right Column - Details -->
          <div class="part-details-section">
            <p-tabView styleClass="part-tabs">
              <p-tabPanel header="Description">
                <div class="description-content">
                  <p>{{ part.description }}</p>

                  <h3>Compatibility</h3>
                  <div class="compatibility-table">
                    <p-table [value]="part.compatibleModels" styleClass="p-datatable-sm">
                      <ng-template pTemplate="header">
                        <tr>
                          <th>Brand</th>
                          <th>Model</th>
                          <th>Years</th>
                        </tr>
                      </ng-template>
                      <ng-template pTemplate="body" let-model>
                        <tr>
                          <td>{{ model.brand }}</td>
                          <td>{{ model.model }}</td>
                          <td>{{ model.yearFrom }} - {{ model.yearTo }}</td>
                        </tr>
                      </ng-template>
                    </p-table>
                  </div>
                </div>
              </p-tabPanel>

              <p-tabPanel header="Specifications">
                <div class="specifications-content">
                  <p-accordion [multiple]="true">
                    <p-accordionTab header="Part Details">
                      <div class="specification-item">
                        <span class="spec-label">Brand:</span>
                        <span class="spec-value">{{ part.brand }}</span>
                      </div>
                      <div class="specification-item">
                        <span class="spec-label">Category:</span>
                        <span class="spec-value">{{ part.category }}</span>
                      </div>
                      <div class="specification-item">
                        <span class="spec-label">Part Number:</span>
                        <span class="spec-value">{{ part.partNumber }}</span>
                      </div>
                    </p-accordionTab>

                    <p-accordionTab header="Dimensions & Weight" [disabled]="true">
                      <div class="specification-item">
                        <span class="spec-label">Dimensions:</span>
                        <span class="spec-value">Not available</span>
                      </div>
                      <div class="specification-item">
                        <span class="spec-label">Weight:</span>
                        <span class="spec-value">Not available</span>
                      </div>
                    </p-accordionTab>

                    <p-accordionTab header="Manufacturer Information">
                      <div class="specification-item">
                        <span class="spec-label">Manufacturer:</span>
                        <span class="spec-value">{{ part.brand }}</span>
                      </div>
                      <div class="specification-item">
                        <span class="spec-label">Country of Origin:</span>
                        <span class="spec-value">Not available</span>
                      </div>
                      <div class="specification-item">
                        <span class="spec-label">Warranty:</span>
                        <span class="spec-value">1 Year Manufacturer Warranty</span>
                      </div>
                    </p-accordionTab>
                  </p-accordion>
                </div>
              </p-tabPanel>

              <p-tabPanel header="Related Parts" [disabled]="relatedParts.length === 0">
                <div class="related-parts-grid">
                  <app-part-card
                    *ngFor="let relatedPart of relatedParts"
                    [part]="relatedPart"
                    (viewDetails)="onRelatedPartClick($event)"
                    (addToCart)="onAddRelatedToCart($event)"
                  ></app-part-card>
                </div>
              </p-tabPanel>

              <p-tabPanel
                header="Replacement Info"
                [disabled]="part.replaces.length === 0 && part.replacedBy.length === 0"
              >
                <div class="replacement-info">
                  <div *ngIf="part.replacedBy.length > 0" class="replaced-by-section">
                    <h3>This part is replaced by:</h3>
                    <div class="related-parts-grid">
                      <app-part-card
                        *ngFor="let replacementPart of replacedByParts"
                        [part]="replacementPart"
                        (viewDetails)="onRelatedPartClick($event)"
                        (addToCart)="onAddRelatedToCart($event)"
                      ></app-part-card>
                    </div>
                  </div>

                  <div *ngIf="part.replaces.length > 0" class="replaces-section">
                    <h3>This part replaces:</h3>
                    <div class="related-parts-grid">
                      <app-part-card
                        *ngFor="let replacedPart of replacesParts"
                        [part]="replacedPart"
                        (viewDetails)="onRelatedPartClick($event)"
                        (addToCart)="onAddRelatedToCart($event)"
                      ></app-part-card>
                    </div>
                  </div>
                </div>
              </p-tabPanel>
            </p-tabView>
          </div>
        </div>
      </div>
    </div>

    <p-toast position="bottom-right"></p-toast>

    <p-dialog
      [(visible)]="addedToCartDialog"
      header="Added to Cart"
      [style]="{ width: '450px' }"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
    >
      <div class="dialog-content">
        <i class="pi pi-check-circle success-icon"></i>
        <div class="dialog-message">
          <h3>{{ part?.name }} has been added to your cart</h3>
          <p>Quantity: {{ quantity }}</p>
        </div>
      </div>
      <div class="dialog-actions">
        <button
          pButton
          label="Continue Shopping"
          icon="pi pi-search"
          class="p-button-outlined p-button-secondary"
          (click)="addedToCartDialog = false"
        ></button>
        <button
          pButton
          label="View Cart"
          icon="pi pi-shopping-cart"
          class="p-button-primary"
          (click)="goToCart()"
        ></button>
      </div>
    </p-dialog>
  `,
  styles: [
    `
      .breadcrumb {
        margin: var(--spacing-md) 0;
        color: var(--neutral-600);
      }

      .breadcrumb a {
        color: var(--primary-color);
        text-decoration: none;
      }

      .breadcrumb a:hover {
        text-decoration: underline;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-xl) 0;
      }

      .loading-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top: 4px solid var(--primary-color);
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin-bottom: var(--spacing-sm);
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .part-not-found {
        text-align: center;
        padding: var(--spacing-xl) 0;
      }

      .not-found-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--spacing-lg) 0;
      }

      .not-found-icon {
        font-size: 3rem;
        color: var(--warning-color);
        margin-bottom: var(--spacing-md);
      }

      .part-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
      }

      .part-title {
        margin: 0;
        color: var(--neutral-900);
      }

      .part-badges {
        display: flex;
        gap: var(--spacing-xs);
      }

      .part-main-content {
        display: flex;
        gap: var(--spacing-lg);
      }

      .part-image-section {
        flex: 1;
        max-width: 400px;
      }

      .part-image-container {
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: var(--spacing-md);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
      }

      .part-image {
        width: 100%;
        display: block;
      }

      .purchase-card {
        margin-bottom: var(--spacing-md);
      }

      .purchase-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-sm);
      }

      .part-number-section {
        display: flex;
        flex-direction: column;
      }

      .label {
        font-size: 0.9rem;
        color: var(--neutral-600);
      }

      .part-number {
        font-weight: 600;
      }

      .part-price-section .price {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--primary-color);
      }

      .provider-section {
        margin-bottom: var(--spacing-md);
        padding-bottom: var(--spacing-md);
        border-bottom: 1px solid var(--neutral-200);
      }

      .provider-name {
        margin-bottom: var(--spacing-xs);
      }

      .provider-rating {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        margin-bottom: var(--spacing-xs);
      }

      .rating-value {
        font-weight: 600;
      }

      .delivery-info {
        color: var(--neutral-700);
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
      }

      .stock-section {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-sm);
        border-radius: 4px;
        margin-bottom: var(--spacing-md);
        font-weight: 500;
      }

      .in-stock {
        background-color: rgba(56, 142, 60, 0.1);
        color: var(--success-color);
      }

      .low-stock {
        background-color: rgba(249, 168, 37, 0.1);
        color: var(--warning-color);
      }

      .out-of-stock {
        background-color: rgba(211, 47, 47, 0.1);
        color: var(--error-color);
      }

      .purchase-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
      }

      .quantity-section {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .quantity-section label {
        min-width: 70px;
      }

      .quantity-input {
        width: 100%;
      }

      .cart-button {
        width: 100%;
        margin-top: var(--spacing-xs);
      }

      .part-details-section {
        flex: 2;
      }

      .compatibility-table {
        margin-top: var(--spacing-sm);
      }

      .specifications-content {
        padding: var(--spacing-xs) 0;
      }

      .specification-item {
        display: flex;
        margin-bottom: var(--spacing-xs);
      }

      .spec-label {
        min-width: 150px;
        font-weight: 600;
      }

      .related-parts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--spacing-md);
        margin-top: var(--spacing-sm);
      }

      .replacement-info h3 {
        margin-bottom: var(--spacing-sm);
        color: var(--primary-color);
      }

      .replaced-by-section {
        margin-bottom: var(--spacing-lg);
      }

      .dialog-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md) 0;
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
        margin: 0;
        color: var(--neutral-600);
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-md);
      }

      @media screen and (max-width: 992px) {
        .part-main-content {
          flex-direction: column;
        }

        .part-image-section {
          max-width: 100%;
        }
      }

      @media screen and (max-width: 576px) {
        .part-header {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-sm);
        }

        .purchase-header {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-xs);
        }
      }
    `,
  ],
})
export class PartDetailComponent implements OnInit {
  isLoading = true;
  part: Part | undefined;
  quantity = 1;
  relatedParts: Part[] = [];
  replacedByParts: Part[] = [];
  replacesParts: Part[] = [];
  addedToCartDialog = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partsService: PartsService,
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const partId = params.get("id");
      if (partId) {
        this.loadPartDetails(partId);
      } else {
        this.isLoading = false;
      }
    });
  }

  loadPartDetails(partId: string): void {
    this.isLoading = true;

    this.partsService.getPartById(partId).subscribe({
      next: (part) => {
        this.part = part;

        if (part) {
          // Load related parts
          const relatedIds = [...part.relatedParts, ...part.replacedBy, ...part.replaces];

          if (relatedIds.length > 0) {
            this.partsService
              .getRelatedParts(relatedIds)
              .pipe(finalize(() => (this.isLoading = false)))
              .subscribe((relatedParts) => {
                // Filter and assign parts to respective arrays
                this.relatedParts = relatedParts.filter((p) => part.relatedParts.includes(p.id));

                this.replacedByParts = relatedParts.filter((p) => part.replacedBy.includes(p.id));

                this.replacesParts = relatedParts.filter((p) => part.replaces.includes(p.id));
              });
          } else {
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error("Error loading part details:", error);
        this.isLoading = false;
      },
    });
  }

  getStockMessage(): string {
    if (!this.part) return "";

    if (this.part.stock === 0) {
      return "Out of Stock";
    } else if (this.part.stock <= 10) {
      return `Low Stock: Only ${this.part.stock} left`;
    } else {
      return `In Stock: ${this.part.stock} available`;
    }
  }

  addToCart(): void {
    if (this.part && this.quantity > 0) {
      this.cartService.addToCart(this.part, this.quantity);
      this.addedToCartDialog = true;
    }
  }

  goToCart(): void {
    this.addedToCartDialog = false;
    this.router.navigate(["/cart"]);
  }

  onRelatedPartClick(part: Part): void {
    this.router.navigate(["/part", part.id]);
  }

  onAddRelatedToCart(part: Part): void {
    this.cartService.addToCart(part, 1);
    this.messageService.add({
      severity: "success",
      summary: "Added to Cart",
      detail: `${part.name} has been added to your cart.`,
    });
  }
}
