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

@Component({
  selector: "app-part-card",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TooltipModule,
    TagModule,
    BadgeModule,
    RatingModule,
    RippleModule,
    FormsModule,
  ],
  templateUrl: "./part-card-component.html",
  styleUrls: ['./part-card.component.scss']
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
      return "Out of Stock";
    } else if (this.part.stock <= 10) {
      return "Low Stock: " + this.part.stock;
    } else {
      return "In Stock: " + this.part.stock;
    }
  }
}
