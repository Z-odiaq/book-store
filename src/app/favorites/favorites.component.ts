
import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { UserService } from '../services/user.Service';
import { CartService } from '../services/CartService';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteBooks: Book[] = [];
  loading = false;
  constructor(public userService: UserService, public cartService : CartService) { }

  ngOnInit() {
    this.loadFavoriteBooks();
    
  }

  loadFavoriteBooks() {
    // fetch favorite books from /books/favorite/:userId API
    this.loading = true;
    fetch(`http://localhost:3000/api/books/favorite/${this.userService.user._id}`)

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
