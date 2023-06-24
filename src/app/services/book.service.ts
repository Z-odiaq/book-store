import { Injectable } from '@angular/core';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  cart: Book[] = []; // Add the cart array

  constructor() { }
}
