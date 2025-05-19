import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { TagModule } from "primeng/tag";
import { BadgeModule } from "primeng/badge";
import { RatingModule } from "primeng/rating";
import { RippleModule } from "primeng/ripple";
import { Part } from "../../../shared/models/part.model";
import { FormsModule } from "@angular/forms";
import { InputNumberModule } from "primeng/inputnumber";
import { AddToCartComponent } from "../../../shared/components/add-to-cart/add-to-cart.component";
import { DividerModule } from "primeng/divider";
import { TabViewModule } from "primeng/tabview";
import { DialogService, DynamicDialogModule, DynamicDialogRef } from "primeng/dynamicdialog";
import { PartEquivalentComponent } from "../part-equivalent/part-equivalent.component";
import { PartDetailComponent } from "../part-detail/part-detail.component";

@Component({
  selector: "app-part-card-list",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TooltipModule,
    TagModule,
    BadgeModule,
    RatingModule,
    TabViewModule,
    RippleModule,
    FormsModule,
    InputNumberModule,
    AddToCartComponent,
    DividerModule,
    DynamicDialogModule,
  ],
  templateUrl: "./part-card-list-component.html",
  providers: [DialogService],
  styleUrls: ["./part-card-list.component.scss"],
})
export class PartCardListComponent {
  ref: DynamicDialogRef | undefined;
  @Input() part!: Part;
  @Output() viewDetails = new EventEmitter<Part>();
  @Output() addToCart = new EventEmitter<Part>();
  @Input() ShowAllOririn? = false;
  oemList: any[] = [];
  quantity = 1;

  constructor(public dialogService: DialogService) {
    this.oemList = [
      {
        make: "Volkswagen",
        oems: [
          { id: "123", oem: "OEM 123", mark: "OEM 123" },
          { id: "456", oem: "OEM 456", mark: "OEM 456" },
          { id: "456", oem: "OEM 456", mark: "OEM 456" },
          { id: "456", oem: "OEM 456", mark: "OEM 456" },
        ],
      },
      {
        make: "BMW",
        oems: [
          { id: "123", oem: "OEM 123", mark: "OEM 123" },
          { id: "456", oem: "OEM 456", mark: "OEM 456" },
          { id: "456", oem: "OEM 456", mark: "OEM 456" },
          { id: "456", oem: "OEM 456", mark: "OEM 456" },
        ],
      },
    ];
  }
  get displayedModels() {
    return this.part.compatibleModels.slice(0, 2);
  }

  getStockLabel(): string {
    if (this.part.stock === 0) {
      return "Non disponible";
    }
    //  else if (this.part.stock <= 10) {
    //   return "Low Stock: " + this.part.stock;
    // }
    else {
      return "En stock: " + this.part.stock;
    }
  }

  formatPrice(price: number): string {
    // make it a string with 3 digits after the decimal point and a 'dt' at the end
    return price.toFixed(3) + " TND";
  }
  getStockStatusClass(): string {
    if (!this.part) return "";
    return this.part.stock > 0 ? "dot-available" : "dot-unavailable";
  }

  getStockStatusText(): string {
    if (!this.part) return "";
    return this.part.stock > 0 ? "En stock" : "Non disponible";
  }

  getQuantity(event: number) {
    this.part.quantity = event;
    this.addToCart.emit(this.part);
  }

  showDetails() {
    this.ref = this.dialogService.open(PartDetailComponent, {
      header: "Details de la pièce",
      modal: true,
      closable: true,
      width: "90vw",
      height: "90vh",
    });
  }

  showEquivalents() {
    this.ref = this.dialogService.open(PartEquivalentComponent, {
      header: "prodruit équivalent",
      width: "90vw",
      height: "90vh",
      modal: true,
      closeOnEscape: true,
      closable: true,
    });
  }
}
