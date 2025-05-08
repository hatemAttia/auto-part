export interface SearchFilters {
  searchTerm?: string;
  carBrand?: string;
  carModel?: string;
  year?: number;
  category?: string;
  brands?: string[];
  providers?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  replacesOthers?: boolean;
}