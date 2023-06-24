import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book';
import { CartService } from '../services/CartService';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  cartBadgeCount: number = 0; // Add the cartBadgeCount property
  favorites: Book[] = [];
  itemsPerPage = 10; // Number of books per page
  currentPage = 1; // Current page number
  totalPages = 1; // Total number of pages
  displayedBooks: Book[] = []; // Books to display on the current page
  
  constructor(private http: HttpClient, private cartService: CartService) { }

  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    this.http.get<Book[]>('http://127.0.0.1:3000/api/books').subscribe(
      (response) => {
        //log length of response
        console.log('Number of books:', response.length);
        this.books = response;
        this.calculateTotalPages();
        this.updateDisplayedBooks();
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }

  addToFavorites(book: Book) {
    // Implement logic to add the book to favorites 
    this.favorites.push(book);
  }

  isFavorite(book: Book): boolean {
    // Implement logic to check if the book is a favorite
    return this.favorites.includes(book);
  }

  toggleFavorite(book: Book) {
    // Implement logic to toggle the favorite state of the book
    if (this.isFavorite(book)) {
      this.favorites.splice(this.favorites.indexOf(book), 1);
    } else {
      this.favorites.push(book);
    }
  }

  openModal(book: Book) {
    // Implement logic to navigate to the book details page
  }

  getBookQuantity(book: Book): number {
    const foundBook = this.cartService.getCartItems().find(item => item._id === book._id);
    return foundBook ? foundBook.quantity : 0;
  }

  addToCart(book: Book) {
    this.cartService.addToCart(book);
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.books.length / this.itemsPerPage);
  }
  
  updateDisplayedBooks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedBooks = this.books.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedBooks();
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedBooks();
    }
  }

  increaseQuantity(book: Book) {

      this.cartService.addToCart(book);

  }

  decreaseQuantity(book: Book) {

        this.cartService.removeFromCart(book);
}
}
