import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-manage-books',
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.css']
})
export class ManageBooksComponent implements OnInit {
  books: Book[] = [];
  displayedBooks: Book[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedPriceRange: string = '';
  categories: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  cartBadgeCount: number = 0;
  favorites: Book[] = [];
  totalPages = 1;
  selectedLanguage: string = 'All';
  languages: string[] = [];
  selectedSort: string = 'title';
  selectedOrder: string = 'asc';
  selectedRating: string = 'All';
  filteredBooks: Book[] = [];

  constructor(public bookService: BookService) { }

  ngOnInit() {
    this.fetchBooks();
  }
  createBook() {
    //this.bookService.createBook();
  }

  deleteBook(book: Book) {
    this.bookService.deleteBook(book);
  }

  editBook(book: Book) {
    this.bookService.editBook(book);
  }

  viewBook(book: Book) {

  }
  searchBooks() {
    this.bookService.searchBooks(this.searchQuery);
    this.updateDisplayedBooks();
  }





  fetchBooks() {
    this.bookService.fetchBooks();
  }

  
  isFavorite(book: Book): boolean {
    return this.bookService.isFavorite(book);
  }



  openModal(book: Book) {
    // Implement logic to navigate to the book details page
  }





  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredBooks.length / this.itemsPerPage);
  }

  updateDisplayedBooks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedBooks = this.filteredBooks.slice(startIndex, startIndex + this.itemsPerPage);
    this.calculateTotalPages();
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
    
  }

  decreaseQuantity(book: Book) {

  }
}
