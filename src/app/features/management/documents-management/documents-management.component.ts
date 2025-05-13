import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { DocumentsManagementService } from '../../../core/services/documents-management.service';
import { BadgeModule } from 'primeng/badge';
import { formatPrice } from '../../../core/utils/format.utils';

@Component({
  selector: 'app-documents-management',
  imports: [
    TabViewModule, 
    TableModule, 
    CommonModule, 
    FormsModule, 
    CalendarModule, 
    ButtonModule, 
    InputTextModule,
    BadgeModule,
  ],
  templateUrl: './documents-management.component.html',
  styleUrl: './documents-management.component.css'
})
export class DocumentsManagementComponent implements OnInit {

  constructor(
    private documentsService: DocumentsManagementService
  ) {

  }

  orders: any[] = [];
  deliveries: any[] = [];
  invoices: any[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;

  ngOnInit(): void {
    this.loadOrders();
  }

  handleTabChange(event: any): void {
    // event.index is the index of the selected tab (0-based)
    switch (event.index) {
      case 0:
        if (!this.orders || this.orders.length === 0) {          
          this.loadOrders();
        }
        break;
      case 1:
        if (!this.deliveries || this.deliveries.length === 0) {
          this.loadDeliveries();
        }
        break;
      case 2:
        if (!this.invoices || this.invoices.length === 0) {
          this.loadInvoices();
        }
        break;
    }
  }

  loadOrders(): void {
    this.documentsService.getOrders().subscribe((data: any) => {
      this.orders = data;
    }, (error: any) => {
      console.error('Error loading orders:', error);
    });
  }

  loadDeliveries(): void {
    this.documentsService.getDeliveries().subscribe((data: any) => {
      this.deliveries = data;
    }, (error: any) => {
      console.error('Error loading deliveries:', error);
    });
  }

  loadInvoices(): void {
    this.documentsService.getInvoices().subscribe((data: any) => {
      this.invoices = data;
    }, (error: any) => {
      console.error('Error loading invoices:', error);
    });
  }

  getStatusSeverity(status: string): "success" | "info" | "warning" | "danger" | "help" | "primary" | "secondary" | "contrast" | null | undefined {
    switch (status) {
      case 'IN_PROGRESS':
        return 'info';
      case 'DELIVERED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'danger';
      default:
        return null;
    }
  }

  getStatusValue(status: string): string {
    switch (status) {
      case 'IN_PROGRESS':
        return 'En cours';
      case 'DELIVERED':
        return 'Livré';
      case 'PENDING':
        return 'En attente';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return '';
    }
  }

  formatPrice(price: number): string {
    return formatPrice(price);
  }

}
