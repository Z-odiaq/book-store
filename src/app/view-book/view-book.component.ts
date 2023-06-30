import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../models/book';
import { MatDialogRef } from '@angular/material/dialog';
import { BookService } from '../services/book.service';
import { UserService } from '../services/user.Service';

@Component({
  selector: 'app-view-book',
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.css']
})
export class ViewBookComponent implements OnInit {
  book: Book = {} as Book;
  isLoading: boolean = true;
  loadingLikes: boolean = true;
  isFavorite: boolean = false;
  isLiked: boolean = false;
  constructor(public bookService: BookService, public dialogRef: MatDialogRef<ViewBookComponent>, public userService: UserService) { }

  ngOnInit() {
    this.getBookById();
    this.checkFavorites();

  }
  checkFavorites() {
    console.log(this.userService.user.favorites.includes(this.book?._id));

    this.userService.user.favorites.includes(this.book?._id) ? this.isFavorite = true : this.isFavorite = false;

  }
  //get book by the id
  getBookById() {
    return this.bookService.getBookById().subscribe((book) => {
      this.book = book;
      this.isLoading = false;
    });
  }

  onCancel(): void {
    // Close the dialog without performing any action
    this.dialogRef.close();
  }
  addToFavorites() {
    console.log('add to favorites', this.book._id, "user");

    this.bookService.addToFavorites(this.book._id)
    this.isFavorite = !this.isFavorite


  }

}
