import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSource = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSource.asObservable();

  constructor() { }

  updateSearchTerm(term: string) {
    this.searchTermSource.next(term);
  }

  getSearchTerm() {
    return this.searchTermSource.value;
  }
}