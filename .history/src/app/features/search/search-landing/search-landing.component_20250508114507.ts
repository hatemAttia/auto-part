import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { SliderModule } from "primeng/slider";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { MessageModule } from "primeng/message";
import { RippleModule } from "primeng/ripple";
import { TooltipModule } from "primeng/tooltip";
import { RatingModule } from "primeng/rating";
import { BadgeModule } from "primeng/badge";

import { PartsService } from "../../../core/services/parts.service";
import { CartService } from "../../../core/services/cart.service";
import { Part } from "../../../shared/models/part.model";
import { SearchFilters } from "../../../shared/models/search-filters.model";
import { PartCardComponent } from "../part-card/part-card.component";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-search-landing",
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
    PartCardComponent,
  ],
  templateUrl: "search-landing.components.html",
  styles: [
    `
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
    `,
  ],
})
export class SearchLandingComponent implements OnInit {
  mainSearchTerm = "";
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
      replacesOthers: [false],
    });
  }

  ngOnInit(): void {
    this.loadFilterOptions();
    this.search(); // Initial search to load all parts
  }

  loadFilterOptions(): void {
    this.isLoading = true;

    // Load car brands
    this.partsService.getAllCarBrands().subscribe((brands) => {
      this.carBrands = brands.map((brand) => ({ label: brand, value: brand }));
    });

    // Load categories
    this.partsService.getAllCategories().subscribe((categories) => {
      this.categories = categories.map((cat) => ({ label: cat, value: cat }));
    });

    // Load brands
    this.partsService.getAllBrands().subscribe((brands) => {
      this.brands = brands.map((brand) => ({ label: brand, value: brand }));
    });

    // Load providers
    this.partsService.getAllProviders().subscribe((providers) => {
      this.providers = providers.map((provider) => ({
        label: provider.name,
        value: provider.id,
        name: provider.name,
        id: provider.id,
      }));
    });
  }

  onCarBrandChange(event: any): void {
    const brand = event.value;
    if (brand) {
      this.partsService.getCarModelsByBrand(brand).subscribe((models) => {
        this.carModels = models.map((model) => ({ label: model, value: model }));
      });
    } else {
      this.carModels = [];
      this.filterForm.get("carModel")?.setValue(null);
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
      replacesOthers: formValues.replacesOthers,
    };

    this.partsService
      .searchParts(filters)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((parts) => {
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
      replacesOthers: false,
    });
    this.mainSearchTerm = "";
    this.carModels = [];
  }

  onViewDetails(part: Part): void {
    this.router.navigate(["/part", part.id]);
  }

  onAddToCart(part: Part): void {
    this.cartService.addToCart(part, 1);
  }
}
