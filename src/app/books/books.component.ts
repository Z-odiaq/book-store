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
  cartBadgeCount: number = 0; // Add the cartBadgeCount property
  favorites: Book[] = [];
  itemsPerPage = 10; // Number of books per page
  currentPage = 1; // Current page number
  totalPages = 1; // Total number of pages
  displayedBooks: Book[] = []; // Books to display on the current page
  filteredBooks: Book[] = [];
  selectedPriceRange: string = "";
  selectedSort: string = "";
  selectedRating: string = "";
  searchTerm: string = "";
  bookGenres: { name: string, count: number }[] = [];


  constructor(private http: HttpClient, public userService: UserService, private cartService: CartService, public bookService: BookService, private dialog: MatDialog) { }
  
  ngOnInit() {
    this.fetchBooks();

  }

  fetchBooks() {

    this.bookService.getBooks().subscribe(
      (books: Book[]) => {
        this.books = books;
        this.filteredBooks = this.books;
        this.CalculateBooksGenre();

      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  CalculateBooksGenre() {
    this.bookGenres = [];
    const genresMap = new Map<string, number>();
    for (const book of this.books) {
      const genre = book.genre;
      if (genresMap.has(genre)) {
        genresMap.set(genre, genresMap.get(genre)! + 1);
      } else {
        genresMap.set(genre, 1);
      }
    }
    console.log(genresMap);
    genresMap.forEach((count, name) => {
      this.bookGenres.push({ name, count });
    });
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


  filterByGenre(genre: string) {
    if (genre === "") {
      // If genre is empty, show all books
      this.filteredBooks = this.books;
    } else {
      // Filter books by genre
      this.filteredBooks = this.books.filter((book) => book.genre === genre);
    }
  }
  searchClear() {
    this.searchTerm = "";
    this.search();
  }
  search() {
    if (this.searchTerm === "") {
      // If genre is empty, show all books
      this.filteredBooks = this.books;
    } else {
      // Filter books by genre
      this.filteredBooks = this.books.filter(book => {
        // Check if the book matches the selected genre, rating, and price criteria

        //check if title contains search term
        const searchTitle = book.title.toLowerCase().includes(this.searchTerm.toLowerCase().trim());
        //check if description contains search term
        const searchDesc = book.description.toLowerCase().includes(this.searchTerm.toLowerCase().trim());
        //check if author contains search term
        const searchAuth = book.author.toLowerCase().includes(this.searchTerm.toLowerCase().trim());

        // Return true if all criteria are matched
        return searchTitle || searchDesc || searchAuth;
      });
      console.log(this.filteredBooks.length);
    }
  }
  sortBooks() {
    if (this.selectedSort !== "") {
      if (this.selectedSort === "title-asc") {
        this.filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
      }
      else if (this.selectedSort === "title-desc") {
        this.filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
      }
      else if (this.selectedSort === "price-asc") {
        this.filteredBooks.sort((a, b) => a.price - b.price);
      }
      else if (this.selectedSort === "price-desc") {
        this.filteredBooks.sort((a, b) => b.price - a.price);
      }
      else if (this.selectedSort === "rating-asc") {
        this.filteredBooks.sort((a, b) => a.rating - b.rating);
      }
      else if (this.selectedSort === "rating-desc") {
        this.filteredBooks.sort((a, b) => b.rating - a.rating);
      }
      else if (this.selectedSort === "pages-asc") {
        this.filteredBooks.sort((a, b) => a.pages - b.pages);
      }
      else if (this.selectedSort === "pages-desc") {
        this.filteredBooks.sort((a, b) => b.pages - a.pages);
      }
      else if (this.selectedSort === "quantity-asc") {
        this.filteredBooks.sort((a, b) => a.quantity - b.quantity);
      }
      else if (this.selectedSort === "quantity-desc") {
        this.filteredBooks.sort((a, b) => b.quantity - a.quantity);
      }
      else if (this.selectedSort === "author-asc") {
        this.filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
      }
      else if (this.selectedSort === "author-desc") {
        this.filteredBooks.sort((a, b) => b.author.localeCompare(a.author));
      }
    } else {
      this.filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  applyFilter() {
    this.filteredBooks = this.books.filter(book => {
      // Check if the book matches the selected genre, rating, and price criteria
      const ratingMatch = this.selectedRating ? Number(book.rating) <= Number(this.selectedRating) : true;
      const priceMatch = this.selectedPriceRange ? this.checkPriceRange(book.price, this.selectedPriceRange) : true;

      return ratingMatch && priceMatch;
    });
  }

  checkPriceRange(bookPrice: number, selectedPrice: string): boolean {
   console.log(bookPrice, selectedPrice);
   
    switch (selectedPrice) {
      case '0-10':
        return bookPrice >= 0 && bookPrice <= 10;
      case '10-25':
        return bookPrice >= 10 && bookPrice <= 25;
      case '25-50':
        return bookPrice >= 25 && bookPrice <= 50;
      case '50+':
        return bookPrice >= 50;
      default:
        return true; // No price filter selected
    }
  }


}
