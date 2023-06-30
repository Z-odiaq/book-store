import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Book } from '../models/book';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.Service';

@Injectable({
  providedIn: 'root'
})
export class BookService {



  bookToView: Book = {} as Book;
  bookToEdit: Book = {} as Book;

  books: Book[] = [];
  filteredBooks: Book[] = [];
  favorites: Book[] = [];
  cart: Book[] = [];
  categories: string[] = [];
  languages: string[] = [];
  displayedBooks: Book[] = [];
  totalPages: number = 1;
  itemsPerPage: number = 10;
  currentPage: number = 1;
  selectedCategory: string = 'All';
  selectedLanguage: string = 'All';
  selectedPriceRange: string = 'All';
  selectedRating: string = 'All';
  selectedSort = 'title';
  selectedOrder = 'asc';

  constructor(private http: HttpClient, public userService: UserService) { }

  OnInit() {
    this.fetchBooks();
  }

  getFavoriteBooks() {
    return this.favorites;
  }


  fetchBooks() {
    this.http.get<Book[]>('http://127.0.0.1:3000/api/books').subscribe(
      (response) => {
        //log length of response
        console.log('Number of books:', response.length);
        this.books = response;
        this.filteredBooks = response;
        //put books genre in categories array
        this.books.forEach(book => {
          if (!this.categories.includes(book.genre)) {
            this.categories.push(book.genre);
          }
        });
        //put books language in language array
        this.books.forEach(book => {
          if (!this.languages.includes(book.language)) {
            this.languages.push(book.language);
          }
        });
        this.calculateTotalPages();
        this.updateDisplayedBooks();
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }


  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredBooks.length / this.itemsPerPage);
  }
  updateDisplayedBooks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedBooks = this.filteredBooks.slice(startIndex, startIndex + this.itemsPerPage);
    console.log('Displayed books:', this.displayedBooks);

    this.calculateTotalPages();
  }
  searchBooks(searchQuery: String) {
    const query = searchQuery.toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query) ||
      book.language.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query)
    );
    this.updateDisplayedBooks();

  }
  clearSearch() {
    this.filteredBooks = this.books;
  }
  deleteBook(book: Book) {
    throw new Error('Method not implemented.');
  }
  editBook(book: Book) {
    throw new Error('Method not implemented.');
  }
  createBook(book: Book) {
    return this.http.post<Book>('http://127.0.0.1:3000/api/books', book);
  }
  updateBook(book: Book) {
    return this.http.put<Book>('http://127.0.0.1:3000/api/books/' + book._id, book);
  }
  getBookById() {
    return this.http.get<Book>('http://127.0.0.1:3000/api/books/' + this.bookToView._id);
  }
  applyFilters() {

    let filteredBooks = this.books;
    // Filter by category
    if (this.selectedCategory !== 'All') {
      filteredBooks = filteredBooks.filter(book => book.genre === this.selectedCategory);
    }

    // Filter by language
    if (this.selectedLanguage !== 'All') {
      filteredBooks = filteredBooks.filter(book => book.language === this.selectedLanguage);
    }

    // Filter by price range
    if (this.selectedPriceRange !== 'All') {
      const priceRange = this.selectedPriceRange.split('-');
      filteredBooks = filteredBooks.filter(book => book.price >= parseInt(priceRange[0]) && book.price <= parseInt(priceRange[1]));
    }

    // Filter by rating
    if (this.selectedRating !== 'All') {
      filteredBooks = filteredBooks.filter(book => book.rating >= parseInt(this.selectedRating));
    }

    // Sort by selected sort option
    // filteredBooks.sort((a, b) => {
    //   if (a[this.selectedSort] < b[this.selectedSort]) {
    //     return this.selectedOrder === 'asc' ? -1 : 1;
    //   }
    //   if (a[this.selectedSort] > b[this.selectedSort]) {
    //     return this.selectedOrder === 'asc' ? 1 : -1;
    //   }
    //   return 0;
    // });

    this.filteredBooks = filteredBooks;
    this.updateDisplayedBooks();
  }
  addToFavorites(Id: string) {
    fetch('http://localhost:3000/api/users/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookId: Id, userId: this.userService.user._id }),
    })
      .then((res) => {
        if (res.status === 200) {
          //check if book is already in favorites of user
          console.log('like addedxsdzd', this.userService.user.favorites);

          if (!this.userService.user.favorites.includes(Id)) {
            this.userService.user.favorites.push(Id);
            this.userService.favoriteBadgeCountSubject.next(this.userService.user.favorites.length);

            console.log('like added');
          } else {
            //pull book from favorites  of user
            this.userService.user.favorites = this.userService.user.favorites.filter((bookId) => bookId !== Id);
            this.userService.favoriteBadgeCountSubject.next(this.userService.user.favorites.length);

            console.log('like removed');
          }
          return true;
        }
        return false;

      })
      .catch((err) => {
        console.log('Error adding like:', err);
        return false;
      });
    return false;



  }
  clearFilters() {
    this.selectedCategory = 'All';
    this.selectedLanguage = 'All';
    this.selectedPriceRange = 'All';
    this.selectedRating = 'All';
    this.applyFilters();
  }
  updateCategoriesAndLanguages(books: Book[]) {
    const categoriesSet = new Set<string>();
    const languagesSet = new Set<string>();

    books.forEach(book => {
      categoriesSet.add(book.genre);
      languagesSet.add(book.language);
    });

    this.categories = Array.from(categoriesSet);
    this.languages = Array.from(languagesSet);
  }
  isFavorite(book: Book): boolean {
    return this.userService.user?.favorites?.includes(book._id);
  }



}