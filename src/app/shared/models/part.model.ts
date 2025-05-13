export interface Part {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  brand: string;
  compatibleModels: CompatibleModel[];
  price: number;
  stock: number;
  provider: Provider;
  relatedParts: string[];
  replacedBy: string[];
  replaces: string[];
  imageUrl: string;
  description: string;
  quantity?: any;
  ShowOririn?: any;
}

export interface CompatibleModel {
  brand: string;
  model: string;
  yearFrom: number;
  yearTo: number;
}

export interface Provider {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
}
