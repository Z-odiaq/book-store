import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';
import { ViewBookComponent } from '../view-book/view-book.component';
import { MatDialog } from '@angular/material/dialog';
import { EditBookComponent } from '../edit-book/edit-book.component';
import { CreateBookComponent } from '../create-book/create-book.component';

@Component({
  selector: 'app-manage-books',
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.css']
})

export class ManageBooksComponent implements OnInit {
  books: Book[] = [];
  totalBooks: number = 0;
  booksSold: number = 0;
  lowQuantityBooks: number = 0;
  bookGenres: { name: string, count: number }[] = [];
  loading: boolean = true;
  filteredBooks: Book[] = [];
  selectedPriceRange: string = "";
  selectedSort: string = "";
  selectedRating: string = "";
  searchTerm: string = "";
  constructor(private bookService: BookService, private dialog: MatDialog) { }

  viewBook(book: Book): void {
    this.bookService.bookToView = book;
    const dialogRef = this.dialog.open(ViewBookComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the dialog close event if needed
      console.log('Dialog closed:', result);
    });
  }
  // Define a variable to store the filtered books

  // Function to filter books by genre
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

  apsplyFilter() {
    //filter by multiple criteria
    this.filteredBooks = this.books;


    if (this.selectedRating !== "") {
      this.filteredBooks = this.filteredBooks.filter((book) => Math.round(Number(book.rating) * 10) / 10 === Number(this.selectedRating));
    } else {
      this.filteredBooks = this.filteredBooks.filter((book) => book.rating >= 0);
      console.log(this.filteredBooks.length);
    }
    if (this.selectedPriceRange !== "") {
      const priceRange = this.selectedPriceRange.split("-");
      const minPrice = Number(priceRange[0]);
      const maxPrice = Number(priceRange[1]);
      this.filteredBooks = this.filteredBooks.filter((book) => book.price >= minPrice && book.price <= maxPrice);
    } else {
      this.filteredBooks = this.filteredBooks.filter((book) => book.price >= 0);
    }


  }

  applyFilter() {
    this.filteredBooks = this.books.filter(book => {
      // Check if the book matches the selected genre, rating, and price criteria
      const ratingMatch = this.selectedRating ? Number(book.rating) <= Number(this.selectedRating) : true;
      const priceMatch = this.selectedPriceRange ? this.checkPriceRange(book.price, this.selectedPriceRange) : true;

      // Return true if all criteria are matched
      return  ratingMatch && priceMatch;
    });
  }

  checkPriceRange(bookPrice: number, selectedPrice: string): boolean {
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


  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    this.bookService.getBooks().subscribe(
      (books: Book[]) => {
        this.books = books;
        this.filteredBooks = this.books;

        this.calculateBookStats();
        this.loading = false;
      },
      (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
  }



  getGenreCount(genre: string) {
    return this.books.filter(book => book.genre === genre).length;
  }
  calculateBookStats() {
    this.totalBooks = this.books.length;
    this.booksSold = this.books.filter(book => book.sold).length;
    this.lowQuantityBooks = this.books.filter(book => book.availableQuantity < 5).length;

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


  editBook(book: Book) {
    this.bookService.bookToView = book;
    const dialogRef = this.dialog.open(EditBookComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed:', result);
    });
  }
  createBook() {
    const dialogRef = this.dialog.open(CreateBookComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed:', result);
    });  }
  deleteBook(book: Book) {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (confirmDelete) {
      const index = this.filteredBooks.findIndex(book => book._id === book._id);
      if (index !== -1) {

        this.bookService.deleteBook(book._id).then(
          (data: boolean) => {
            if (data === true) {
              this.filteredBooks.splice(index, 1);
              this.fetchBooks();
            } else {
              const confirmDelete = window.confirm('There was an error deleteing this book.');
            }
          });
      }
    }
  }
}
