import { Component } from '@angular/core';
import { Book } from '../models/book';

@Component({
  selector: 'app-create-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class CreateBookComponent {
  book: Book =  {
    _id: '',
    title: '',
    author: '',
    price: 0,
    cover: '',
    pages: 0,
    rating: 0,
    discount: 0,
    availableQuantity: 0,
    language: '',
    genre: '',
    description: '',
    comments: [],
    likes: [],

    quantity: 0,
  }; // Create a new instance of the Book class

  createBook() {
    // Implement the logic to create a book using the form data
    // You can access the book details from the `this.book` object

    // Example: Display the book details in the console
    console.log(this.book);
  }
}
