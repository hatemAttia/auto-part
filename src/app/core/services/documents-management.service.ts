import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsManagementService {

  constructor() { }

  orders: any[] = [
    {
      orderNumber: 'CMD-001',
      date: '2023-11-15T00:00:00Z',
      priceHT: 1250.500,
      priceTTC: 1500.600,
      status: 'IN_PROGRESS'
    },
    {
      orderNumber: 'CMD-002',
      date: '2023-11-14T00:00:00Z',
      priceHT: 850.750,
      priceTTC: 1020.900,
      status: 'DELIVERED'
    },
    {
      orderNumber: 'CMD-003',
      date: '2023-11-12T00:00:00Z',
      priceHT: 2340.000,
      priceTTC: 2808.000,
      status: 'PENDING'
    },
    {
      orderNumber: 'CMD-004',
      date: '2023-11-10T00:00:00Z',
      priceHT: 520.300,
      priceTTC: 624.360,
      status: 'CANCELLED'
    },
    {
      orderNumber: 'CMD-005',
      date: '2023-11-08T00:00:00Z',
      priceHT: 1750.000,
      priceTTC: 2100.000,
      status: 'DELIVERED'
    },
    {
      orderNumber: 'CMD-001',
      date: '2023-11-15T00:00:00Z',
      priceHT: 1250.500,
      priceTTC: 1500.600,
      status: 'IN_PROGRESS'
    },
    {
      orderNumber: 'CMD-002',
      date: '2023-11-14T00:00:00Z',
      priceHT: 850.750,
      priceTTC: 1020.900,
      status: 'DELIVERED'
    },
    {
      orderNumber: 'CMD-003',
      date: '2023-11-12T00:00:00Z',
      priceHT: 2340.000,
      priceTTC: 2808.000,
      status: 'PENDING'
    },
    {
      orderNumber: 'CMD-004',
      date: '2023-11-10T00:00:00Z',
      priceHT: 520.300,
      priceTTC: 624.360,
      status: 'CANCELLED'
    },
    {
      orderNumber: 'CMD-005',
      date: '2023-11-08T00:00:00Z',
      priceHT: 1750.000,
      priceTTC: 2100.000,
      status: 'DELIVERED'
    },
    {
      orderNumber: 'CMD-001',
      date: '2023-11-15T00:00:00Z',
      priceHT: 1250.500,
      priceTTC: 1500.600,
      status: 'IN_PROGRESS'
    },
    {
      orderNumber: 'CMD-002',
      date: '2023-11-14T00:00:00Z',
      priceHT: 850.750,
      priceTTC: 1020.900,
      status: 'DELIVERED'
    },
    {
      orderNumber: 'CMD-003',
      date: '2023-11-12T00:00:00Z',
      priceHT: 2340.000,
      priceTTC: 2808.000,
      status: 'PENDING'
    },
    {
      orderNumber: 'CMD-004',
      date: '2023-11-10T00:00:00Z',
      priceHT: 520.300,
      priceTTC: 624.360,
      status: 'CANCELLED'
    },
    {
      orderNumber: 'CMD-005',
      date: '2023-11-08T00:00:00Z',
      priceHT: 1750.000,
      priceTTC: 2100.000,
      status: 'DELIVERED'
    }
  ];

  deliveries: any[] = [
    {
      orderNumber: 'CMD-001',
      deliveryDate: '2023-11-20T14:30:00Z',
      deliveryNumber: 'DEL-1001'
    },
    {
      orderNumber: 'CMD-002',
      deliveryDate: '2023-11-16T09:15:00Z',
      deliveryNumber: 'DEL-1002'
    },
    {
      orderNumber: 'CMD-003',
      deliveryDate: '2023-11-18T11:45:00Z',
      deliveryNumber: 'DEL-1003'
    },
    {
      orderNumber: 'CMD-005',
      deliveryDate: '2023-11-12T16:20:00Z',
      deliveryNumber: 'DEL-1004'
    },
    {
      orderNumber: 'CMD-007',
      deliveryDate: '2023-11-22T10:00:00Z',
      deliveryNumber: 'DEL-1005'
    },
    {
      orderNumber: 'CMD-001',
      deliveryDate: '2023-11-20T14:30:00Z',
      deliveryNumber: 'DEL-1001'
    },
    {
      orderNumber: 'CMD-002',
      deliveryDate: '2023-11-16T09:15:00Z',
      deliveryNumber: 'DEL-1002'
    },
    {
      orderNumber: 'CMD-003',
      deliveryDate: '2023-11-18T11:45:00Z',
      deliveryNumber: 'DEL-1003'
    },
    {
      orderNumber: 'CMD-005',
      deliveryDate: '2023-11-12T16:20:00Z',
      deliveryNumber: 'DEL-1004'
    },
    {
      orderNumber: 'CMD-007',
      deliveryDate: '2023-11-22T10:00:00Z',
      deliveryNumber: 'DEL-1005'
    },
    {
      orderNumber: 'CMD-001',
      deliveryDate: '2023-11-20T14:30:00Z',
      deliveryNumber: 'DEL-1001'
    },
    {
      orderNumber: 'CMD-002',
      deliveryDate: '2023-11-16T09:15:00Z',
      deliveryNumber: 'DEL-1002'
    },
    {
      orderNumber: 'CMD-003',
      deliveryDate: '2023-11-18T11:45:00Z',
      deliveryNumber: 'DEL-1003'
    },
    {
      orderNumber: 'CMD-005',
      deliveryDate: '2023-11-12T16:20:00Z',
      deliveryNumber: 'DEL-1004'
    },
    {
      orderNumber: 'CMD-007',
      deliveryDate: '2023-11-22T10:00:00Z',
      deliveryNumber: 'DEL-1005'
    }
  ];

  invoices: any[] = [
    {
      invoiceNumber: 'INV-001',
      date: '2023-11-17T10:30:00Z',
      isPaid: true,
      orderNumber: 'CMD-001',
      amount: 1500.60
    },
    {
      invoiceNumber: 'INV-002',
      date: '2023-11-15T14:45:00Z',
      isPaid: true,
      orderNumber: 'CMD-002',
      amount: 1020.90
    },
    {
      invoiceNumber: 'INV-003',
      date: '2023-11-19T09:20:00Z',
      isPaid: false,
      orderNumber: 'CMD-003',
      amount: 2808.00
    },
    {
      invoiceNumber: 'INV-004',
      date: '2023-11-13T16:10:00Z',
      isPaid: false,
      orderNumber: 'CMD-005',
      amount: 2100.00
    },
    {
      invoiceNumber: 'INV-005',
      date: '2023-11-21T11:05:00Z',
      isPaid: true,
      orderNumber: 'CMD-007',
      amount: 935.25
    },
    {
      invoiceNumber: 'INV-001',
      date: '2023-11-17T10:30:00Z',
      isPaid: true,
      orderNumber: 'CMD-001',
      amount: 1500.60
    },
    {
      invoiceNumber: 'INV-002',
      date: '2023-11-15T14:45:00Z',
      isPaid: true,
      orderNumber: 'CMD-002',
      amount: 1020.90
    },
    {
      invoiceNumber: 'INV-003',
      date: '2023-11-19T09:20:00Z',
      isPaid: false,
      orderNumber: 'CMD-003',
      amount: 2808.00
    },
    {
      invoiceNumber: 'INV-004',
      date: '2023-11-13T16:10:00Z',
      isPaid: false,
      orderNumber: 'CMD-005',
      amount: 2100.00
    },
    {
      invoiceNumber: 'INV-005',
      date: '2023-11-21T11:05:00Z',
      isPaid: true,
      orderNumber: 'CMD-007',
      amount: 935.25
    },
    {
      invoiceNumber: 'INV-001',
      date: '2023-11-17T10:30:00Z',
      isPaid: true,
      orderNumber: 'CMD-001',
      amount: 1500.60
    },
    {
      invoiceNumber: 'INV-002',
      date: '2023-11-15T14:45:00Z',
      isPaid: true,
      orderNumber: 'CMD-002',
      amount: 1020.90
    },
    {
      invoiceNumber: 'INV-003',
      date: '2023-11-19T09:20:00Z',
      isPaid: false,
      orderNumber: 'CMD-003',
      amount: 2808.00
    },
    {
      invoiceNumber: 'INV-004',
      date: '2023-11-13T16:10:00Z',
      isPaid: false,
      orderNumber: 'CMD-005',
      amount: 2100.00
    },
    {
      invoiceNumber: 'INV-005',
      date: '2023-11-21T11:05:00Z',
      isPaid: true,
      orderNumber: 'CMD-007',
      amount: 935.25
    }
  ]


  getOrders(): Observable<any[]> {
    return of(this.orders);
  }

  getDeliveries(): Observable<any[]> {
    return of(this.deliveries);
  }

  getInvoices(): Observable<any[]> {
    return of(this.invoices);
  }
}
