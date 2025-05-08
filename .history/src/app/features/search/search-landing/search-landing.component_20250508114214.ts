import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { RatingModule } from 'primeng/rating';
import { BadgeModule } from 'primeng/badge';

import { PartsService } from '../../../core/services/parts.service';
import { CartService } from '../../../core/services/cart.service';
import { Part } from '../../../shared/models/part.model';
import { SearchFilters } from '../../../shared/models/search-filters.model';
import { PartCardComponent } from '../part-card/part-card.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-search-landing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    SliderModule,
    CheckboxModule,
    ButtonModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    MessageModule,
    RippleModule,
    TooltipModule,
    RatingModule,
    BadgeModule,
    PartCardComponent
  ],
  template: `
    <div class="container">
      <div class="search-header">
        <h1>Find Auto Parts</h1>
        <p class="subtitle">Search our extensive catalog of quality auto parts for your vehicles</p>
      </div>
      
      <!-- Main Search Bar -->
      <div class="main-search-container">
        <div class="p-input-icon-left main-search">
          <i class="pi pi-search"></i>
          <input 
            type="text" 
            pInputText 
            [(ngModel)]="mainSearchTerm" 
            placeholder="Search by keyword, part number, or description" 
            (keyup.enter)="search()"
            class="w-full"
          />
        </div>
        <button 
          pButton 
          icon="pi pi-search" 
          label="Search" 
          class="p-button-primary search-button" 
          (click)="search()"
        ></button>
      </div>
      
      <div class="search-content">
        <!-- Filters -->
        <aside class="filters-panel">
          <p-card header="Refine Search">
            <form [formGroup]="filterForm">
              <h3>Vehicle</h3>
              <div class="field">
                <label for="carBrand">Car Brand</label>
                <p-dropdown
                  id="carBrand"
                  formControlName="carBrand"
                  [options]="carBrands"
                  placeholder="Select Brand"
                  [filter]="true"
                  [showClear]="true"
                  (onChange)="onCarBrandChange($event)"
                  styleClass="w-full"
                ></p-dropdown>
              </div>
              
              <div class="field">
                <label for="carModel">Car Model</label>
                <p-dropdown
                  id="carModel"
                  formControlName="carModel"
                  [options]="carModels"
                  placeholder="Select Model"
                  [filter]="true"
                  [showClear]="true"
                  [disabled]="!filterForm.get('carBrand')?.value"
                  styleClass="w-full"
                ></p-dropdown>
              </div>
              
              <div class="field">
                <label for="year">Year</label>
                <input 
                  id="year" 
                  type="number" 
                  pInputText 
                  formControlName="year" 
                  placeholder="Year"
                  class="w-full"
                  min="1900"
                  max="2030"
                />
              </div>
              
              <p-divider></p-divider>
              
              <h3>Part Details</h3>
              <div class="field">
                <label for="category">Category</label>
                <p-dropdown
                  id="category"
                  formControlName="category"
                  [options]="categories"
                  placeholder="Select Category"
                  [showClear]="true"
                  styleClass="w-full"
                ></p-dropdown>
              </div>
              
              <div class="field">
                <label for="brands">Brand</label>
                <p-multiSelect
                  id="brands"
                  formControlName="brands"
                  [options]="brands"
                  placeholder="Select Brands"
                  [filter]="true"
                  styleClass="w-full"
                  [maxSelectedLabels]="2"
                ></p-multiSelect>
              </div>
              
              <div class="field">
                <label>Price Range</label>
                <div class="price-slider">
                  <p-slider 
                    formControlName="priceRange" 
                    [range]="true" 
                    [min]="0" 
                    [max]="500" 
                    styleClass="w-full"
                  ></p-slider>
                </div>
                <div class="price-inputs">
                  <span>${{filterForm.get('priceRange')?.value[0]}}</span>
                  <span>${{filterForm.get('priceRange')?.value[1]}}</span>
                </div>
              </div>
              
              <div class="field">
                <label for="providers">Provider</label>
                <p-multiSelect
                  id="providers"
                  formControlName="providers"
                  [options]="providers"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select Providers"
                  styleClass="w-full"
                  [maxSelectedLabels]="1"
                ></p-multiSelect>
              </div>
              
              <p-divider></p-divider>
              
              <h3>Availability</h3>
              <div class="field-checkbox">
                <p-checkbox 
                  formControlName="inStock" 
                  [binary]="true" 
                  inputId="inStock"
                ></p-checkbox>
                <label for="inStock">In Stock Only</label>
              </div>
              
              <div class="field-checkbox">
                <p-checkbox 
                  formControlName="replacesOthers" 
                  [binary]="true" 
                  inputId="replacesOthers"
                ></p-checkbox>
                <label for="replacesOthers">Replaces Other Parts</label>
              </div>
              
              <div class="filter-actions">
                <button 
                  pButton 
                  type="button" 
                  label="Reset Filters" 
                  class="p-button-outlined p-button-secondary" 
                  (click)="resetFilters()"
                ></button>
                <button 
                  pButton 
                  type="button" 
                  label="Apply Filters" 
                  class="p-button-primary" 
                  (click)="search()"
                ></button>
              </div>
            </form>
          </p-card>
        </aside>
        
        <!-- Results -->
        <section class="results-panel">
          <div class="results-header">
            <h2>Search Results</h2>
            <div class="results-meta" *ngIf="!isLoading">
              <span *ngIf="parts.length > 0">{{parts.length}} parts found</span>
              <span *ngIf="parts.length === 0">No parts found</span>
            </div>
          </div>
          
          <div class="loading-container" *ngIf="isLoading">
            <p-progressSpinner></p-progressSpinner>
            <p>Searching for parts...</p>
          </div>
          
          <div class="no-results" *ngIf="!isLoading && parts.length === 0">
            <p-message 
              severity="info" 
              text="No parts match your search criteria. Try adjusting your filters or search term."
              styleClass="w-full"
            ></p-message>
          </div>
          
          <div class="results-grid" *ngIf="!isLoading && parts.length > 0">
            <app-part-card 
              *ngFor="let part of parts" 
              [part]="part"
              (viewDetails)="onViewDetails($event)"
              (addToCart)="onAddToCart($event)"
            ></app-part-card>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .search-header {
      text-align: center;
      margin-bottom: var(--spacing-lg);
    }
    
    .search-header h1 {
      font-size: 2rem;
      color: var(--primary-color);
      margin-bottom: var(--spacing-xs);
    }
    
    .subtitle {
      color: var(--neutral-600);
      font-size: 1.1rem;
    }
    
    .main-search-container {
      display: flex;
      margin-bottom: var(--spacing-lg);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .main-search {
      flex: 1;
    }
    
    .main-search ::ng-deep input {
      border-radius: 8px 0 0 8px;
      padding: 1rem 1rem 1rem 2.5rem;
      border-right: none;
      font-size: 1.1rem;
    }
    
    .search-button {
      border-radius: 0 8px 8px 0;
      padding: 0 1.5rem;
    }
    
    .search-content {
      display: flex;
      gap: var(--spacing-lg);
    }
    
    .filters-panel {
      width: 320px;
      flex-shrink: 0;
    }
    
    .filters-panel ::ng-deep .p-card {
      height: 100%;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    
    .results-panel {
      flex: 1;
    }
    
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }
    
    .results-header h2 {
      margin: 0;
    }
    
    .results-meta {
      color: var(--neutral-600);
    }
    
    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-md);
    }
    
    .field {
      margin-bottom: var(--spacing-md);
    }
    
    .field label {
      display: block;
      margin-bottom: var(--spacing-xs);
      font-weight: 500;
    }
    
    .field-checkbox {
      display: flex;
      align-items: center;
      margin-bottom: var(--spacing-sm);
    }
    
    .field-checkbox label {
      margin-left: var(--spacing-xs);
      margin-bottom: 0;
    }
    
    h3 {
      font-size: 1rem;
      margin-bottom: var(--spacing-sm);
      color: var(--primary-color);
    }
    
    .price-slider {
      margin-bottom: var(--spacing-sm);
    }
    
    .price-inputs {
      display: flex;
      justify-content: space-between;
      color: var(--neutral-600);
      font-size: 0.9rem;
    }
    
    .filter-actions {
      display: flex;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-md);
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--spacing-xl) 0;
      color: var(--neutral-600);
    }
    
    .no-results {
      padding: var(--spacing-lg) 0;
    }
    
    @media screen and (max-width: 992px) {
      .search-content {
        flex-direction: column;
      }
      
      .filters-panel {
        width: 100%;
      }
      
      .filters-panel ::ng-deep .p-card {
        margin-bottom: var(--spacing-md);
      }
    }
    
    @media screen and (max-width: 576px) {
      .main-search-container {
        flex-direction: column;
      }
      
      .main-search ::ng-deep input {
        border-radius: 8px 8px 0 0;
        border-right: 1px solid #ced4da;
        border-bottom: none;
      }
      
      .search-button {
        border-radius: 0 0 8px 8px;
      }
      
      .results-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SearchLandingComponent implements OnInit {
  mainSearchTerm = '';
  isLoading = false;
  parts: Part[] = [];
  filterForm: FormGroup;
  
  // Filter options
  carBrands: any[] = [];
  carModels: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  providers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private partsService: PartsService,
    private cartService: CartService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      carBrand: [null],
      carModel: [null],
      year: [null],
      category: [null],
      brands: [[]],
      priceRange: [[0, 500]],
      providers: [[]],
      inStock: [false],
      replacesOthers: [false]
    });
  }

  ngOnInit(): void {
    this.loadFilterOptions();
    this.search(); // Initial search to load all parts
  }

  loadFilterOptions(): void {
    this.isLoading = true;
    
    // Load car brands
    this.partsService.getAllCarBrands().subscribe(brands => {
      this.carBrands = brands.map(brand => ({ label: brand, value: brand }));
    });
    
    // Load categories
    this.partsService.getAllCategories().subscribe(categories => {
      this.categories = categories.map(cat => ({ label: cat, value: cat }));
    });
    
    // Load brands
    this.partsService.getAllBrands().subscribe(brands => {
      this.brands = brands.map(brand => ({ label: brand, value: brand }));
    });
    
    // Load providers
    this.partsService.getAllProviders().subscribe(providers => {
      this.providers = providers.map(provider => ({ 
        label: provider.name, 
        value: provider.id,
        name: provider.name,
        id: provider.id
      }));
    });
  }

  onCarBrandChange(event: any): void {
    const brand = event.value;
    if (brand) {
      this.partsService.getCarModelsByBrand(brand).subscribe(models => {
        this.carModels = models.map(model => ({ label: model, value: model }));
      });
    } else {
      this.carModels = [];
      this.filterForm.get('carModel')?.setValue(null);
    }
  }

  search(): void {
    this.isLoading = true;
    
    const formValues = this.filterForm.value;
    const filters: SearchFilters = {
      searchTerm: this.mainSearchTerm,
      carBrand: formValues.carBrand,
      carModel: formValues.carModel,
      year: formValues.year,
      category: formValues.category,
      brands: formValues.brands,
      minPrice: formValues.priceRange[0],
      maxPrice: formValues.priceRange[1],
      providers: formValues.providers,
      inStock: formValues.inStock,
      replacesOthers: formValues.replacesOthers
    };
    
    this.partsService.searchParts(filters)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(parts => {
        this.parts = parts;
      });
  }

  resetFilters(): void {
    this.filterForm.reset({
      carBrand: null,
      carModel: null,
      year: null,
      category: null,
      brands: [],
      priceRange: [0, 500],
      providers: [],
      inStock: false,
      replacesOthers: false
    });
    this.mainSearchTerm = '';
    this.carModels = [];
  }

  onViewDetails(part: Part): void {
    this.router.navigate(['/part', part.id]);
  }

  onAddToCart(part: Part): void {
    this.cartService.addToCart(part, 1);
  }
}