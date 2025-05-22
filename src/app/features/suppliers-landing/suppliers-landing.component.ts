import { Component, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";

interface Supplier {
  name: string;
  logoUrl: string;
}

@Component({
  selector: "app-suppliers",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section suppliers-section">
      <div class="container">
        <h2 class="section-title m-0" style="font-size: 36px;">Nos fournisseurs des piéces</h2>
        <p class="section-subtitle text-left m-0 mb-5">
          Grandes offres de pièces de voiture des meilleurs fabricants.
        </p>

        <div class="suppliers-slider" #suppliersSlider style="margin-top:3rem;">
          <div class="suppliers-track" #suppliersTrack>
            <div *ngFor="let supplier of suppliers" class="supplier-logo">
              <img [src]="supplier.logoUrl" [alt]="supplier.name + ' logo'" />
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .suppliers-section {
        background-color: #ffffff;
        padding: var(--space-xl) 0;
      }

      .section-subtitle {
        text-align: center;
        margin-bottom: var(--space-xl);
        color: var(--neutral-700);
      }

      .suppliers-slider {
        position: relative;
        overflow: hidden;
        padding: var(--space-lg) 0;
      }

      .suppliers-track {
        display: flex;
        animation: scroll 30s linear infinite;
      }

      .supplier-logo {
        flex: 0 0 auto;
        width: 180px;
        height: 100px;
        margin: 0 var(--space-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        padding: var(--space-md);
        transition: transform 0.3s ease;
      }

      .supplier-logo:hover {
        transform: scale(1.05);
      }

      .supplier-logo img {
        max-width: 100%;
        max-height: 80px;
        object-fit: contain;
      }

      @keyframes scroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(calc(-200px * 5));
        }
      }

      @media (max-width: 768px) {
        .supplier-logo {
          width: 150px;
          height: 80px;
        }
      }
    `,
  ],
})
export class SuppliersComponent implements AfterViewInit {
  suppliers: Supplier[] = [
    {
      name: "Bosch",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
    {
      name: "Denso",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
    {
      name: "Valeo",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
    {
      name: "NGK",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
    {
      name: "Brembo",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
    {
      name: "Continental",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
    {
      name: "Hella",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
    {
      name: "Mahle",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
    {
      name: "Delphi",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
    {
      name: "Febi",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
    {
      name: "Mahle",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
    {
      name: "Delphi",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
    {
      name: "Febi",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0o0e8iCgvRE76o15okRBXBVYXmNmqK0A45_HBAhsES-deH4NeVeYtUHBehHTCwaMirE&usqp=CAU",
    },
  ];

  // For a real implementation, we would duplicate these suppliers to ensure
  // a seamless infinite scroll effect

  ngAfterViewInit() {
    // In a real implementation, we would initialize the slider functionality here
  }
}
