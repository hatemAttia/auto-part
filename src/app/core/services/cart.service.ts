import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CartItem } from "../../shared/models/cart-item.model";
import { Part } from "../../shared/models/part.model";

@Injectable({
  providedIn: "root",
})
export class CartService {
  // The actual cart items array
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  // Total price of all items in cart
  private cartTotal = new BehaviorSubject<number>(0);
  public cartTotal$ = this.cartTotal.asObservable();

  // Count of items in cart (sum of quantities)
  private itemCount = new BehaviorSubject<number>(0);
  public itemCount$ = this.itemCount.asObservable();

  constructor() {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const items = JSON.parse(savedCart);
      this.cartItems.next(items);
      this.updateCartTotal();
      this.updateItemCount();
    }
  }

  addToCart(part: Part, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex((item) => item.part.id === part.id);

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      this.cartItems.next(updatedItems);
    } else {
      // Add new item
      this.cartItems.next([...currentItems, { part, quantity }]);
    }

    this.updateCartTotal();
    this.updateItemCount();
    this.saveCartToLocalStorage();
  }

  updateQuantity(partId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(partId);
      return;
    }

    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.map((item) =>
      item.part.id === partId ? { ...item, quantity } : item
    );

    this.cartItems.next(updatedItems);
    this.updateCartTotal();
    this.updateItemCount();
    this.saveCartToLocalStorage();
  }

  removeFromCart(partId: string): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter((item) => item.part.id !== partId);

    this.cartItems.next(updatedItems);
    this.updateCartTotal();
    this.saveCartToLocalStorage();
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.cartTotal.next(0);
    localStorage.removeItem("cart");
  }

  getItemCount(): Observable<number> {
    return this.itemCount.asObservable();
  }

  private updateItemCount(): void {
    const count = this.cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
    this.itemCount.next(count);
  }

  getTotalPrice(): Observable<number> {
    return this.cartTotal.asObservable();
  }

  private updateCartTotal(): void {
    const total = this.cartItems.value.reduce(
      (sum, item) => sum + item.part.price * item.quantity,
      0
    );
    this.cartTotal.next(total);
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem("cart", JSON.stringify(this.cartItems.value));
  }
}
