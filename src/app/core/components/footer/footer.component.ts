import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <span class="logo-text">AutoParts<span class="highlight">B2B</span></span>
            <p class="tagline">Your trusted source for automotive parts</p>
          </div>
          
          <div class="footer-links">
            <div class="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Order Status</a></li>
                <li><a href="#">Returns</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Shipping Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} AutoPartsB2B. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--neutral-800);
      color: var(--neutral-300);
      padding: var(--spacing-lg) 0 var(--spacing-sm);
    }
    
    .footer-content {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }
    
    .footer-logo {
      flex: 1;
      min-width: 250px;
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      display: block;
      margin-bottom: var(--spacing-xs);
    }
    
    .highlight {
      color: var(--accent-color);
    }
    
    .tagline {
      font-size: 0.9rem;
      color: var(--neutral-400);
    }
    
    .footer-links {
      flex: 2;
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
    }
    
    .footer-section {
      flex: 1;
      min-width: 150px;
    }
    
    .footer-section h4 {
      color: white;
      margin-bottom: var(--spacing-sm);
      font-size: 1rem;
    }
    
    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-section li {
      margin-bottom: var(--spacing-xs);
    }
    
    .footer-section a {
      color: var(--neutral-400);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .footer-section a:hover {
      color: white;
    }
    
    .footer-bottom {
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--neutral-700);
      text-align: center;
      font-size: 0.8rem;
      color: var(--neutral-500);
    }
    
    @media screen and (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: var(--spacing-md);
      }
      
      .footer-links {
        flex-direction: column;
        gap: var(--spacing-md);
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}