import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { Part } from '../../../shared/models/part.model';

@Component({
  selector: 'app-part-card',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TooltipModule,
    TagModule,
    BadgeModule,
    RatingModule,
    RippleModule
  ],
  template: `
    <p-card styleClass="part-card" [style]="{'height': '100%'}">
      <ng-template pTemplate="header">
        <div 
          class="part-image" 
          [style.background-image]="'url(' + part.imageUrl + ')'"
          (click)="viewDetails.emit(part)"
        >
          <div class="part-badges">
            <p-tag 
              *ngIf="part.replaces.length > 0" 
              severity="info" 
              value="Replacement Part"
            ></p-tag>
            <p-tag 
              *ngIf="part.stock <= 10 && part.stock > 0" 
              severity="warning" 
              value="Low Stock"
            ></p-tag>
            <p-tag 
              *ngIf="part.stock === 0" 
              severity="danger" 
              value="Out of Stock"
            ></p-tag>
          </div>
        </div>
      </ng-template>
      
      <div class="part-content">
        <div class="part-header" (click)="viewDetails.emit(part)">
          <h3 class="part-name">{{ part.name }}</h3>
          <span class="part-number">{{ part.partNumber }}</span>
        </div>
        
        <div class="part-compatibility">
          <span class="compatibility-item" *ngFor="let model of displayedModels; let i = last">
            {{ model.brand }} {{ model.model }} ({{ model.yearFrom }}-{{ model.yearTo }})
            <span *ngIf="!i">, </span>
          </span>
          <span 
            *ngIf="part.compatibleModels.length > 2" 
            class="more-models"
            pTooltip="View all compatible models"
            (click)="viewDetails.emit(part)"
          >
            +{{ part.compatibleModels.length - 2 }} more
          </span>
        </div>
        
        <div class="part-details">
          <div class="provider-info">
            <span class="provider-name">{{ part.provider.name }}</span>
            <p-rating 
              [ngModel]="part.provider.rating" 
              [readonly]="true" 
              [cancel]="false" 
              [stars]="5"
            ></p-rating>
            <span class="delivery-time">{{ part.provider.deliveryTime }}</span>
          </div>
          
          <div class="part-price-stock">
            <span class="price">${{ part.price.toFixed(2) }}</span>
            <span class="stock" [ngClass]="{'in-stock': part.stock > 10, 'low-stock': part.stock <= 10 && part.stock > 0, 'out-of-stock': part.stock === 0}">
              {{ getStockLabel() }}
            </span>
          </div>
        </div>
      </div>
      
      <ng-template pTemplate="footer">
        <div class="part-actions">
          <button 
            pButton 
            type="button" 
            label="Details" 
            icon="pi pi-info-circle" 
            class="p-button-outlined p-button-secondary"
            (click)="viewDetails.emit(part)"
          ></button>
          <button 
            pButton 
            type="button" 
            label="Add to Cart" 
            icon="pi pi-shopping-cart" 
            [disabled]="part.stock === 0"
            class="p-button-primary"
            (click)="addToCart.emit(part)"
            pRipple
          ></button>
        </div>
      </ng-template>
    </p-card>
  `,
  styles: [`
    .part-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      height: 100%;
    }
    
    .part-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }
    
    .part-image {
      height: 180px;
      background-size: cover;
      background-position: center;
      position: relative;
      cursor: pointer;
      border-radius: 6px 6px 0 0;
      transition: opacity 0.2s ease;
    }
    
    .part-image:hover {
      opacity: 0.9;
    }
    
    .part-badges {
      position: absolute;
      top: var(--spacing-xs);
      right: var(--spacing-xs);
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .part-content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .part-header {
      margin-bottom: var(--spacing-sm);
      cursor: pointer;
    }
    
    .part-name {
      margin: 0 0 4px 0;
      font-size: 1.1rem;
      color: var(--neutral-900);
    }
    
    .part-number {
      color: var(--neutral-600);
      font-size: 0.9rem;
    }
    
    .part-compatibility {
      font-size: 0.85rem;
      color: var(--neutral-700);
      margin-bottom: var(--spacing-sm);
    }
    
    .more-models {
      color: var(--primary-color);
      cursor: pointer;
      margin-left: 4px;
    }
    
    .more-models:hover {
      text-decoration: underline;
    }
    
    .part-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      margin-top: auto;
    }
    
    .provider-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .provider-name {
      font-weight: 500;
    }
    
    .delivery-time {
      font-size: 0.8rem;
      color: var(--neutral-600);
    }
    
    .part-price-stock {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .price {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--neutral-900);
    }
    
    .stock {
      font-size: 0.9rem;
      padding: 2px 8px;
      border-radius: 4px;
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
    
    .part-actions {
      display: flex;
      gap: var(--spacing-sm);
    }
    
    .part-actions button {
      flex: 1;
    }
    
    ::ng-deep .p-card-body {
      padding: var(--spacing-sm);
    }
    
    ::ng-deep .p-card-content {
      padding: 0;
      height: 100%;
    }
    
    ::ng-deep p-rating .p-rating .p-rating-item.p-rating-item-active .p-rating-icon {
      color: var(--warning-color);
    }
    
    ::ng-deep .p-card .p-card-footer {
      padding-top: var(--spacing-sm);
    }
  `]
})
export class PartCardComponent {
  @Input() part!: Part;
  @Output() viewDetails = new EventEmitter<Part>();
  @Output() addToCart = new EventEmitter<Part>();

  get displayedModels() {
    return this.part.compatibleModels.slice(0, 2);
  }

  getStockLabel(): string {
    if (this.part.stock === 0) {
      return 'Out of Stock';
    } else if (this.part.stock <= 10) {
      return 'Low Stock: ' + this.part.stock;
    } else {
      return 'In Stock: ' + this.part.stock;
    }
  }
}