
import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { UserService } from '../services/user.Service';
import { CartService } from '../services/CartService';
import { BookService } from '../services/book.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewBookComponent } from '../view-book/view-book.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteBooks: Book[] = [];
  loading = false;
  constructor(public userService: UserService, public cartService : CartService,public bookService : BookService,private dialog: MatDialog) { }

  ngOnInit() {
    this.loadFavoriteBooks();
    
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
  remove(book: Book) {
    this.bookService.addToFavorites(book._id);
    this.favoriteBooks = this.favoriteBooks.filter(item => item._id !== book._id);
  }
  loadFavoriteBooks() {
    // fetch favorite books from /books/favorite/:userId API
    this.loading = true;
    fetch(`http://127.0.0.1:3000/api/books/favorite/${this.userService.user._id}`)

      .then(response => { 
        console.log(response);
        
        return response.json()
      })
      .then((books: Book[]) => {
        this.favoriteBooks = books;
        console.log(this.favoriteBooks);
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      });

  }
  getBookQuantity(book: Book): number {
    const foundBook = this.cartService.getCartItems().find(item => item._id === book._id);

    return foundBook ? foundBook.quantity : 0;
  }
  notInCart(book: Book): boolean {
    return this.getBookQuantity(book) === 0;
  }
  
}
