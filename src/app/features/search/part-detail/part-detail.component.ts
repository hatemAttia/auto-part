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
import { AddToCartComponent } from "../../../shared/components/add-to-cart/add-to-cart.component";
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
    AddToCartComponent,
  ],
  providers: [MessageService],
  templateUrl: './part-detail.component.html',
  styleUrls: ['./part-detail.component.scss']
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
  ) { }

  ngOnInit(): void {
    // Original code that gets part ID from route params
    // this.route.paramMap.subscribe((params) => {
    //   const partId = params.get("id");
    //   if (partId) {
    //     this.loadPartDetails(partId);
    //   } else {
    //     this.isLoading = false;
    //   }
    // });

    // For testing: always use part ID 1
    this.loadPartDetails("1");
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
  addToCart(quantity: number): void {
    if (this.part && quantity > 0) {
      this.cartService.addToCart(this.part, quantity);
      this.quantity = quantity; // Save quantity for dialog
      this.addedToCartDialog = true;
    }
  }

  goToCart(): void {
    this.addedToCartDialog = false;
    this.router.navigate(["/cart"]);
  }

  formatPrice(price: number): string {
    // make it a string with 3 digits after the decimal point and a 'dt' at the end
    return price.toFixed(3) + ' TND';
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
