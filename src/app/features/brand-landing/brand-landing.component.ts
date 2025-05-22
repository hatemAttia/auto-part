import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

interface CarBrand {
  name: string;
  logoUrl: string;
}

@Component({
  selector: "app-brands",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section brands-section mt-3">
      <div class="container">
        <h2 class="section-title m-0" style="font-size: 36px;">Nos marques automobile</h2>
        <p class="section-subtitle  text-left m-0 mb-5">
          Nous proposons des pièces pour tous les principaux fabricants de voitures
        </p>
        <!-- <div style="    border-bottom: 3px #D0001A solid; margin: 1rem 0;width: 300px;"></div> -->
        <div class="brands-grid" style="margin-top:3rem;">
          <a
            *ngFor="let brand of brands; let i = index"
            href="#"
            class="brand-card"
            [ngStyle]="{ 'animation-delay': i * 0.1 + 's' }"
          >
            <img [src]="brand.logoUrl" [alt]="brand.name + ' logo'" />
            <!-- <h3>{{ brand.name }}</h3> -->
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .brands-section {
        background-color: var(--neutral-100);
        padding: var(--space-xl) 0 var(--space-xxl);
      }

      .section-subtitle {
        text-align: center;
        margin-bottom: var(--space-xl);
        color: var(--neutral-700);
      }

      .brands-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-lg);
        margin-bottom: var(--space-xl);
      }

      .brand-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--space-lg);
        background-color: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        animation: fadeIn 0.5s ease forwards;
        opacity: 0;
        text-align: center;
      }

      .brand-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-md);
      }

      .brand-card img {
        width: 100px;
        height: 60px;
        object-fit: contain;
        margin-bottom: var(--space-md);
      }

      .brand-card h3 {
        font-size: var(--font-size-md);
        color: var(--neutral-900);
        margin: 0;
      }

      .view-all-brands {
        text-align: center;
        margin-top: var(--space-xl);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @media (max-width: 768px) {
        .brands-grid {
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        }
      }

      @media (max-width: 480px) {
        .brands-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class BrandsComponent {
  brands: CarBrand[] = [
    { name: "Toyota", logoUrl: "https://via.placeholder.com/100x60/FFFFFF/000000?text=TOYOTA" },
    { name: "Honda", logoUrl: "https://via.placeholder.com/100x60/FFFFFF/000000?text=HONDA" },
    { name: "Ford", logoUrl: "https://via.placeholder.com/100x60/FFFFFF/000000?text=FORD" },
    {
      name: "Chevrolet",
      logoUrl: "https://via.placeholder.com/100x60/FFFFFF/000000?text=CHEVROLET",
    },
    { name: "BMW", logoUrl: "https://via.placeholder.com/100x60/FFFFFF/000000?text=BMW" },
    { name: "Mercedes", logoUrl: "https://via.placeholder.com/100x60/FFFFFF/000000?text=MERCEDES" },
    { name: "Volkswagen", logoUrl: "https://via.placeholder.com/100x60/FFFFFF/000000?text=VW" },
    { name: "Nissan", logoUrl: "https://via.placeholder.com/100x60/FFFFFF/000000?text=NISSAN" },
    { name: "Audi", logoUrl: "https://via.placeholder.com/100x60/FFFFFF/000000?text=AUDI" },
    { name: "Hyundai", logoUrl: "https://via.placeholder.com/100x60/FFFFFF/000000?text=HYUNDAI" },
  ];
}
