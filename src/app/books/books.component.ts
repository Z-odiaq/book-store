import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book';
import { CartService } from '../services/CartService';
import { BookService } from '../services/book.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewBookComponent } from '../view-book/view-book.component';
import { UserService } from '../services/user.Service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  cartBadgeCount: number = 0; // Add the cartBadgeCount property
  favorites: Book[] = [];
  itemsPerPage = 10; // Number of books per page
  currentPage = 1; // Current page number
  totalPages = 1; // Total number of pages
  displayedBooks: Book[] = []; // Books to display on the current page
  searchQuery: string = ''; // Search query
  selectedCategory: string = 'All'; // Selected category
  selectedLanguage: string = 'All'; // Selected language
  language: string[] = [];
  selectedSort: string = 'title'; // Selected sort option
  selectedOrder: string = 'asc'; // Selected sort order
  categories: string[] = [];
  selectedPriceRange: string = 'All'; // Selected price range
  selectedRating: string = 'All'; // Selected rating


  constructor(private http: HttpClient,public userService: UserService, private cartService: CartService, public bookService: BookService, private dialog: MatDialog) { }
  ngOnInit() {
    this.fetchBooks();
  }

  searchBooks() {
    this.bookService.searchBooks(this.searchQuery);
  }
  fetchBooks() {
    this.bookService.fetchBooks();
  }
  openModal(book: Book): void {
    this.bookService.bookToView = book;
    const dialogRef = this.dialog.open(ViewBookComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the dialog close event if needed
      console.log('Dialog closed:', result);
    });
  }


  getBookQuantity(book: Book): number {
    const foundBook = this.cartService.getCartItems().find(item => item._id === book._id);

    return foundBook ? foundBook.quantity : 0;
  }

  addToCart(book: Book) {
    this.cartService.addToCart(book);
  }
  previousPage() {
    if (this.bookService.currentPage > 1) {
      this.bookService.currentPage--;
      this.bookService.updateDisplayedBooks();
    }
  }

  nextPage() {
    if (this.bookService.currentPage < this.bookService.totalPages) {
      this.bookService.currentPage++;
      this.bookService.updateDisplayedBooks();
    }
  }

  increaseQuantity(book: Book) {
    this.cartService.addToCart(book);
  }

  decreaseQuantity(book: Book) {
    this.cartService.removeFromCart(book);
  }
}
