import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { Part } from "../../../shared/models/part.model";
import { FormsModule } from "@angular/forms";
import { AddToCartComponent } from "../../../shared/components/add-to-cart/add-to-cart.component";

@Component({
  selector: "app-part-card",
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    FormsModule,
    AddToCartComponent,
  ],
  templateUrl: "./part-card-component.html",
  styleUrls: ['./part-card.component.scss']
})
export class PartCardComponent {
  @Input() part!: Part;
  @Output() viewDetails = new EventEmitter<Part>();
  @Output() addToCart = new EventEmitter<Part>();
}
