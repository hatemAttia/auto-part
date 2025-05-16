import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { DropdownModule } from 'primeng/dropdown';
import { DocumentsManagementService } from '../../../core/services/documents-management.service';
import { formatPrice } from '../../../core/utils/format.utils';
import { TableParams } from '../../../shared/models/tableParams.interface';

interface Column {
  field: string;
  header: string;
  type?: 'text' | 'date' | 'price' | 'status' | 'boolean';
}

@Component({
  selector: 'app-documents-management',
  imports: [
    TableModule, 
    CommonModule, 
    FormsModule, 
    CalendarModule, 
    ButtonModule, 
    InputTextModule,
    BadgeModule,
    RouterModule,
    DropdownModule
  ],
  templateUrl: './documents-management.component.html',
  styleUrl: './documents-management.component.scss'
})
export class DocumentsManagementComponent implements OnInit {
    currentDocType: string = 'orders';
  displayData: any[] = [];
  columns: Column[] = [];
  
  orders: any[] = [];
  deliveries: any[] = [];
  invoices: any[] = [];
    // Table parameters using the TableParams interface
  tableParams: TableParams = {
    pageSize: 10,
    pageNumber: 0,
    startDate: undefined,
    endDate: undefined,
    sortField: undefined,
    order: 'ASC',
    filters: {
      status: '',
      isPaid: null
    }
  };
  
  // Filter options
  statusOptions: { label: string, value: string }[] = [
    { label: 'Tous', value: '' },
    { label: 'En cours', value: 'IN_PROGRESS' },
    { label: 'Livré', value: 'DELIVERED' },
    { label: 'En attente', value: 'PENDING' },
    { label: 'Annulé', value: 'CANCELLED' }
  ];
  
  paymentStatusOptions: { label: string, value: boolean | null }[] = [
    { label: 'Tous', value: null },
    { label: 'Payé', value: true },
    { label: 'Non payé', value: false }
  ];

  constructor(
    private documentsService: DocumentsManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}  
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentDocType = params['type'] || 'orders';
      this.setColumns();
      // Reset filters when changing document type
      this.resetFilters();
      this.loadData();
    });
  }

  getHeader() {
    switch (this.currentDocType) {
      case 'orders':
        return 'commandes';
      case 'deliveries':
        return 'bons de livraisons';
      case 'invoices':
        return 'factures';
      default:
        return '';
    }
  }
  setColumns(): void {
    switch (this.currentDocType) {
      case 'orders':
        this.columns = [
          { field: 'orderNumber', header: 'N° commande', type: 'text' },
          { field: 'date', header: 'Date', type: 'date' },
          { field: 'priceHT', header: 'Prix HT', type: 'price' },
          { field: 'priceTTC', header: 'Prix TTC', type: 'price' },
          { field: 'status', header: 'Statut', type: 'status' }
        ];
        break;
      case 'deliveries':
        this.columns = [
          { field: 'deliveryNumber', header: 'N° bon de livraison', type: 'text' },
          { field: 'deliveryDate', header: 'Date de livraison', type: 'date' },
          { field: 'orderNumber', header: 'N° commande', type: 'text' }
        ];
        break;
      case 'invoices':
        this.columns = [
          { field: 'invoiceNumber', header: 'N° facture', type: 'text' },
          { field: 'date', header: 'Date', type: 'date' },
          { field: 'isPaid', header: 'Payé', type: 'boolean' }
        ];
        break;
      default:
        this.columns = [];
        break;
    }
  }

  loadData(): void {
    switch (this.currentDocType) {
      case 'orders':
        this.loadOrders();
        break;
      case 'deliveries':
        this.loadDeliveries();
        break;
      case 'invoices':
        this.loadInvoices();
        break;
      default:
        // Default to orders if no valid type is provided
        this.loadOrders();
        this.router.navigate(['/private/documents/orders']);
        break;
    }
  }

  loadOrders(): void {
    this.documentsService.getOrders().subscribe((data: any) => {
      this.orders = data;
      this.displayData = this.orders;
    }, (error: any) => {
      console.error('Error loading orders:', error);
    });
  }

  loadDeliveries(): void {
    this.documentsService.getDeliveries().subscribe((data: any) => {
      this.deliveries = data;
      this.displayData = this.deliveries;
    }, (error: any) => {
      console.error('Error loading deliveries:', error);
    });
  }

  loadInvoices(): void {
    this.documentsService.getInvoices().subscribe((data: any) => {
      this.invoices = data;
      this.displayData = this.invoices;
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
    applyFilters(): void {
    let filteredData: any[] = [];
    
    switch (this.currentDocType) {
      case 'orders':
        filteredData = [...this.orders];        // Apply status filter if selected
        const statusFilter = this.tableParams.filters?.['status'];
        if (statusFilter) {
          filteredData = filteredData.filter(order => order.status === statusFilter);
        }
        break;
        
      case 'deliveries':
        filteredData = [...this.deliveries];
        break;
        
      case 'invoices':
        filteredData = [...this.invoices];        // Apply payment status filter if selected
        const isPaidFilter = this.tableParams.filters?.['isPaid'];
        if (isPaidFilter !== undefined) {
          filteredData = filteredData.filter(invoice => invoice.isPaid === isPaidFilter);
        }
        break;
        
      default:
        filteredData = [];
    }
    
    // Apply date filters if selected
    if (this.tableParams.startDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.date || item.deliveryDate);
        return itemDate >= this.tableParams.startDate!;
      });
    }
    
    if (this.tableParams.endDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.date || item.deliveryDate);
        return itemDate <= this.tableParams.endDate!;
      });
    }
    
    this.displayData = filteredData;
  }
    // Reset filters
  resetFilters(): void {
    this.tableParams = {
      pageSize: 10,
      pageNumber: 0,
      startDate: undefined,
      endDate: undefined,
      sortField: undefined,
      order: 'ASC',
      filters: {
        status: '',
        isPaid: null
      }
    };
    this.loadData();
  }
}
