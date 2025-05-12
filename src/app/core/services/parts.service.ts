import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Part } from '../../shared/models/part.model';
import { SearchFilters } from '../../shared/models/search-filters.model';

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  private mockParts: Part[] = [
    {
      id: '1',
      name: 'Brake Disc',
      partNumber: 'BD-1234',
      category: 'Braking System',
      brand: 'BremboTech',
      compatibleModels: [
        { brand: 'Toyota', model: 'Camry', yearFrom: 2018, yearTo: 2023 },
        { brand: 'Honda', model: 'Accord', yearFrom: 2018, yearTo: 2022 }
      ],
      price: 89.99,
      stock: 45,
      provider: {
        id: '1',
        name: 'AutoParts Express',
        rating: 4.7,
        deliveryTime: '2-3 business days'
      },
      relatedParts: ['2', '5'],
      replacedBy: [],
      replaces: ['3'],
      imageUrl: 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'High-performance brake disc with superior heat dissipation and durability.'
    },
    {
      id: '2',
      name: 'Brake Pad Set',
      partNumber: 'BP-5678',
      category: 'Braking System',
      brand: 'BremboTech',
      compatibleModels: [
        { brand: 'Toyota', model: 'Camry', yearFrom: 2018, yearTo: 2023 },
        { brand: 'Honda', model: 'Accord', yearFrom: 2018, yearTo: 2022 }
      ],
      price: 45.99,
      stock: 78,
      provider: {
        id: '1',
        name: 'AutoParts Express',
        rating: 4.7,
        deliveryTime: '2-3 business days'
      },
      relatedParts: ['1', '6'],
      replacedBy: [],
      replaces: [],
      imageUrl: 'https://images.pexels.com/photos/13009437/pexels-photo-13009437.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Premium ceramic brake pads offering quiet braking and minimal dust.'
    },
    {
      id: '3',
      name: 'Brake Disc (Previous Gen)',
      partNumber: 'BD-1000',
      category: 'Braking System',
      brand: 'BremboTech',
      compatibleModels: [
        { brand: 'Toyota', model: 'Camry', yearFrom: 2010, yearTo: 2017 },
        { brand: 'Honda', model: 'Accord', yearFrom: 2010, yearTo: 2017 }
      ],
      price: 69.99,
      stock: 12,
      provider: {
        id: '2',
        name: 'Parts Unlimited',
        rating: 4.5,
        deliveryTime: '3-5 business days'
      },
      relatedParts: ['4'],
      replacedBy: ['1'],
      replaces: [],
      imageUrl: 'https://images.pexels.com/photos/10481830/pexels-photo-10481830.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Standard brake disc for older model vehicles. Compatible with original manufacturer specifications.'
    },
    {
      id: '4',
      name: 'Air Filter',
      partNumber: 'AF-2345',
      category: 'Engine Components',
      brand: 'FilterPro',
      compatibleModels: [
        { brand: 'Toyota', model: 'Camry', yearFrom: 2015, yearTo: 2023 },
        { brand: 'Toyota', model: 'Corolla', yearFrom: 2016, yearTo: 2023 },
        { brand: 'Honda', model: 'Civic', yearFrom: 2016, yearTo: 2022 }
      ],
      price: 19.99,
      stock: 120,
      provider: {
        id: '2',
        name: 'Parts Unlimited',
        rating: 4.5,
        deliveryTime: '3-5 business days'
      },
      relatedParts: [],
      replacedBy: [],
      replaces: [],
      imageUrl: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'High-efficiency air filter for improved engine performance and fuel economy.'
    },
    {
      id: '5',
      name: 'Brake Caliper',
      partNumber: 'BC-9876',
      category: 'Braking System',
      brand: 'BremboTech',
      compatibleModels: [
        { brand: 'Toyota', model: 'Camry', yearFrom: 2018, yearTo: 2023 },
        { brand: 'Honda', model: 'Accord', yearFrom: 2018, yearTo: 2022 }
      ],
      price: 129.99,
      stock: 23,
      provider: {
        id: '3',
        name: 'Premium Auto Supply',
        rating: 4.8,
        deliveryTime: '1-2 business days'
      },
      relatedParts: ['1', '2'],
      replacedBy: [],
      replaces: [],
      imageUrl: 'https://images.pexels.com/photos/4480526/pexels-photo-4480526.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'High-performance brake caliper with precision engineering for optimal braking force.'
    },
    {
      id: '6',
      name: 'Oil Filter',
      partNumber: 'OF-5432',
      category: 'Engine Components',
      brand: 'FilterPro',
      compatibleModels: [
        { brand: 'Toyota', model: 'All Models', yearFrom: 2010, yearTo: 2023 },
        { brand: 'Honda', model: 'All Models', yearFrom: 2010, yearTo: 2023 },
        { brand: 'Ford', model: 'All Models', yearFrom: 2010, yearTo: 2023 }
      ],
      price: 12.99,
      stock: 200,
      provider: {
        id: '2',
        name: 'Parts Unlimited',
        rating: 4.5,
        deliveryTime: '3-5 business days'
      },
      relatedParts: [],
      replacedBy: [],
      replaces: [],
      imageUrl: 'https://images.pexels.com/photos/3819864/pexels-photo-3819864.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Premium oil filter designed to remove harmful contaminants from engine oil.'
    }
  ];

  constructor() {}

  searchParts(filters: SearchFilters): Observable<Part[]> {
    // In a real app, this would call an API endpoint with the filters
    let filteredParts = this.mockParts;
    
    // Apply filters
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredParts = filteredParts.filter(part => 
        part.name.toLowerCase().includes(term) || 
        part.partNumber.toLowerCase().includes(term) ||
        part.description.toLowerCase().includes(term)
      );
    }
    
    if (filters.brands && filters.brands.length > 0) {
      filteredParts = filteredParts.filter(part => filters.brands!.includes(part.brand));
    }
    
    if (filters.category) {
      filteredParts = filteredParts.filter(part => part.category === filters.category);
    }
    
    if (filters.providers && filters.providers.length > 0) {
      filteredParts = filteredParts.filter(part => filters.providers!.includes(part.provider.id));
    }
    
    if (filters.minPrice !== undefined) {
      filteredParts = filteredParts.filter(part => part.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      filteredParts = filteredParts.filter(part => part.price <= filters.maxPrice!);
    }
    
    if (filters.carBrand) {
      filteredParts = filteredParts.filter(part => 
        part.compatibleModels.some(model => model.brand === filters.carBrand)
      );
      
      if (filters.carModel) {
        filteredParts = filteredParts.filter(part => 
          part.compatibleModels.some(model => 
            model.brand === filters.carBrand && 
            (model.model === filters.carModel || model.model === 'All Models')
          )
        );
        
        if (filters.year) {
          const year = filters.year;
          filteredParts = filteredParts.filter(part => 
            part.compatibleModels.some(model => 
              model.brand === filters.carBrand && 
              (model.model === filters.carModel || model.model === 'All Models') &&
              model.yearFrom <= year && model.yearTo >= year
            )
          );
        }
      }
    }
    
    if (filters.inStock) {
      filteredParts = filteredParts.filter(part => part.stock > 0);
    }
    
    return of(filteredParts).pipe(delay(800)); // Simulate network delay
  }

  getPartById(id: string): Observable<Part | undefined> {
    const part = this.mockParts.find(p => p.id === id);
    return of(part).pipe(delay(500)); // Simulate network delay
  }

  getEquivalentParts(id: string): Observable<Part[]> {
    const part = this.mockParts.find(p => p.id === id);
    if (!part) {
      return of([]).pipe(delay(500)); // Simulate network delay
    }
    const relatedParts = this.mockParts.filter(p => 
      part.relatedParts.includes(p.id) || 
      part.replacedBy.includes(p.id) || 
      part.replaces.includes(p.id)
    );
    return of(relatedParts).pipe(delay(500)); // Simulate network delay
  }

  getRelatedParts(partIds: string[]): Observable<Part[]> {
    const parts = this.mockParts.filter(p => partIds.includes(p.id));
    return of(parts).pipe(delay(500)); // Simulate network delay
  }

  getAllBrands(): Observable<string[]> {
    const brands = Array.from(new Set(this.mockParts.map(p => p.brand)));
    return of(brands).pipe(delay(300));
  }

  getAllCategories(): Observable<string[]> {
    const categories = Array.from(new Set(this.mockParts.map(p => p.category)));
    return of(categories).pipe(delay(300));
  }

  getAllProviders(): Observable<{id: string, name: string}[]> {
    const providers = Array.from(
      new Map(this.mockParts.map(p => [p.provider.id, {id: p.provider.id, name: p.provider.name}])).values()
    );
    return of(providers).pipe(delay(300));
  }

  getAllCarBrands(): Observable<string[]> {
    const brands = Array.from(
      new Set(this.mockParts.flatMap(p => p.compatibleModels.map(m => m.brand)))
    );
    return of(brands).pipe(delay(300));
  }

  getCarModelsByBrand(brand: string): Observable<string[]> {
    const models = Array.from(
      new Set(
        this.mockParts
          .flatMap(p => p.compatibleModels)
          .filter(m => m.brand === brand)
          .map(m => m.model)
      )
    );
    return of(models).pipe(delay(300));
  }
}