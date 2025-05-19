import { Component, OnInit, OnDestroy } from "@angular/core";
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
import { SearchService } from "../../../core/services/search.service";
import { Part } from "../../../shared/models/part.model";
import { SearchFilters } from "../../../shared/models/search-filters.model";
import { PartCardComponent } from "../part-card/part-card.component";
import { finalize } from "rxjs/operators";
import { Subscription } from "rxjs";
import { PartCardListComponent } from "../part-card-list/part-card-list.component";

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
    PartCardListComponent,
  ],
  templateUrl: "search-landing.components.html",
  styleUrls: ["./search-landing.component.scss"],
})
export class SearchLandingComponent implements OnInit, OnDestroy {
  mainSearchTerm = "";
  isLoading = false;
  parts: Part[] = [];
  filterForm: FormGroup;
  private searchSubscription: Subscription = new Subscription();
  isGrid = false;
  // Filter options
  carBrands: any[] = [];
  carModels: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  providers: any[] = [];
  showCarBrand = true;
  updateCarBrand = false;
  selectedMake = "";
  selectedModel = "";
  selectedYear = "";
  selectedCategory = "";
  constructor(
    private fb: FormBuilder,
    private partsService: PartsService,
    private cartService: CartService,
    private searchService: SearchService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      carBrand: [null],
      carModel: [null],
      year: [null],
      category: [null],
      brands: [[]],
      priceRange: [[0, 50000]],
      providers: [[]],
      inStock: [false],
      replacesOthers: [false],
    });
  }

  ngOnInit(): void {
    this.loadFilterOptions();

    // Subscribe to search service to get search term from header
    this.searchSubscription = this.searchService.searchTerm$.subscribe((term) => {
      if (this.mainSearchTerm !== term) {
        this.mainSearchTerm = term;
        this.search(); // Trigger search when term changes
      }
    });

    // Initial search to load all parts
    this.search();
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadFilterOptions(): void {
    this.isLoading = true;

    // Load car brands
    this.partsService.getAllCarBrands().subscribe((brands) => {
      this.carBrands = brands.map((brand) => ({ label: brand, value: brand }));
      this.carModels = brands.map((brand) => ({ label: brand, value: brand }));
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
      priceRange: [0, 50000],
      providers: [],
      inStock: false,
      replacesOthers: false,
    });

    // Clear the search term in both the local component and the shared service
    this.mainSearchTerm = "";
    this.searchService.updateSearchTerm("");

    this.carModels = [];
    this.search(); // Perform search with reset filters
  }

  onViewDetails(part: Part): void {
    this.router.navigate(["/private/part", part.id]);
  }

  onAddToCart(part: Part): void {
    this.cartService.addToCart(part, part.quantity);
  }

  makes: any[] = [
    { id: "toyota", name: "Toyota" },
    { id: "honda", name: "Honda" },
    { id: "ford", name: "Ford" },
    { id: "bmw", name: "BMW" },
    { id: "mercedes", name: "Mercedes-Benz" },
    { id: "volkswagen", name: "Volkswagen" },
  ];

  models: any[] = [];

  // Years from 2023 down to 1990
  // years: number[] = Array.from({ length: 34 }, (_, i) => 2023 - i);

  years = [
    { id: "camry", name: "Camry" },
    { id: "corolla", name: "Corolla" },
    { id: "rav4", name: "RAV4" },
  ];
  modelsByMake: Record<string, any[]> = {
    toyota: [
      { id: "camry", name: "Camry" },
      { id: "corolla", name: "Corolla" },
      { id: "rav4", name: "RAV4" },
    ],
    honda: [
      { id: "civic", name: "Civic" },
      { id: "accord", name: "Accord" },
      { id: "cr-v", name: "CR-V" },
    ],
    ford: [
      { id: "f150", name: "F-150" },
      { id: "mustang", name: "Mustang" },
      { id: "escape", name: "Escape" },
    ],
    bmw: [
      { id: "3-series", name: "3 Series" },
      { id: "5-series", name: "5 Series" },
      { id: "x5", name: "X5" },
    ],
    mercedes: [
      { id: "c-class", name: "C-Class" },
      { id: "e-class", name: "E-Class" },
      { id: "gla", name: "GLA" },
    ],
    volkswagen: [
      { id: "golf", name: "Golf" },
      { id: "jetta", name: "Jetta" },
      { id: "tiguan", name: "Tiguan" },
    ],
  };

  onMakeChange() {
    this.selectedModel = "";
    this.selectedYear = "";
    if (this.selectedMake) {
      this.models = this.modelsByMake[this.selectedMake] || [];
    } else {
      this.models = [];
    }
  }

  canSearch(): boolean {
    return !!(this.selectedMake && this.selectedModel && this.selectedYear);
  }
  changeCar() {
    console.log("Searching for parts with:", {
      make: this.selectedMake,
      model: this.selectedModel,
      year: this.selectedYear,
    });

    // In a real application, this would navigate to search results
    alert("Search functionality would be implemented here");
  }
  // Tracks whether filters are expanded (true) or collapsed (false) on mobile
  filtersExpanded = false; // Default to expanded on desktop

  toggleFilters() {
    this.filtersExpanded = !this.filtersExpanded;
  }
}


