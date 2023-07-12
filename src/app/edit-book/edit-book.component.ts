import { Component } from '@angular/core';
import { Book } from '../models/book';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent {
  book : Book = {} as Book;

  constructor(private http: HttpClient) { }
  updateBook() {
    // Retrieve the form data
    const formData = new FormData();
    formData.append('title', this.book.title);
    formData.append('author', this.book.author);
    formData.append('price', this.book.price.toString());
    formData.append('sold', this.book.sold.toString());
    formData.append('cover', this.book.cover);
    
    // Add other form fields
  
    // Check if a PDF file was selected
    const pdfFileInput = document.querySelector('input[name="pdfVersion"]') as HTMLInputElement;
    if (pdfFileInput && pdfFileInput.files && pdfFileInput.files.length > 0) {
      formData.append('pdfVersion', pdfFileInput.files[0]);
    }
  
    // Make the API request to update the book
    this.http.post<any>('http://127.0.0.1:3000/api/books/' + this.book._id, formData).subscribe(
      (response) => {
        response = response.json();
        if (response.success) {
          // Book updated successfully
          // Handle any further actions or notifications
        } else {
          // Failed to update the book
          // Handle the error or show an alert
        }
      },
      (error) => {
        // Handle the error or show an alert
      }
    );
  }
  
}
