import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { SuppliersComponent } from "../suppliers-landing/suppliers-landing.component";
import { FeaturesComponent } from "../feature-landing/feature-landing.component";
import { BrandsComponent } from "../brand-landing/brand-landing.component";

@Component({
  selector: "app-landing-page",
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    SuppliersComponent,
    FeaturesComponent,
    BrandsComponent,
  ],
  templateUrl: "./landing-page.component.html",
  styleUrl: "./landing-page.component.css",
})
export class LandingPageComponent {
  selectedMake = "";
  selectedModel = "";
  selectedYear = "";
  selectedCategory = "";
  isLoading = false;
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
  years: number[] = Array.from({ length: 34 }, (_, i) => 2023 - i);

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

  search() {
    console.log("Searching for parts with:", {
      make: this.selectedMake,
      model: this.selectedModel,
      year: this.selectedYear,
    });

    // In a real application, this would navigate to search results
    alert("Search functionality would be implemented here");
  }
}
