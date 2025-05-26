import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: "app-features",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section features-section">
      <div class="container">
        <div class="features-grid">
          <div
            *ngFor="let feature of features; let i = index"
            class="feature-card"
            [ngStyle]="{ 'animation-delay': i * 0.1 + 's' }"
          >
            <div class="feature-icon">
              <img [src]="feature.icon" alt="" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <!-- <p class="feature-description">{{ feature.description }}</p> -->
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .features-section {
        background-color: var(--neutral-100);
        padding: var(--space-xl) 0;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--space-lg);
      }

      .feature-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        // padding: var(--space-lg);
        //   background-color: white;
        //   border-radius: var(--radius-md);
        //   box-shadow: var(--shadow-sm);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        animation: fadeInUp 0.5s ease forwards;
        opacity: 0;
      }

      .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-md);
      }

      .feature-icon {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        //  background-color: var(--primary-light);
        color: white;
        border-radius: 50%;
        margin-bottom: var(--space-md);
        font-size: 2rem;
      }

      .feature-title {
        color: #003984;
        font-weight: 800;
        font-size: var(--font-size-xl);
        margin-bottom: var(--space-sm);
      }

      .feature-description {
        color: var(--neutral-700);
        line-height: 1.6;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 768px) {
        .features-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 480px) {
        .features-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class FeaturesComponent {
  features: Feature[] = [
    {
      icon: "assets/img/ticket.png",

      title: "Grande disponibilité",
      description:
        "Over 100,000 parts in stock for immediate delivery to get your vehicle back on the road quickly.",
    },
    {
      icon: "assets/img/icon-2.png",

      title: "Qualité garantie",
      description:
        "We only sell parts from reputable manufacturers with proper certification and warranty.",
    },
    {
      icon: "assets/img/ticket.png",

      title: "Prix compétitif",
      description:
        "Get the best value with our competitive pricing and regular special offers on popular parts.",
    },
    {
      icon: "assets/img/icon-4.png",
      title: "Service client",
      description:
        "Our expert team is available to help you find the right part for your specific vehicle needs.",
    },
  ];
}
