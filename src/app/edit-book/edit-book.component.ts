import { Component } from '@angular/core';
import { Book } from '../models/book';
import { HttpClient } from '@angular/common/http';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent {
  book : Book = this.bookService.bookToView;

  constructor(private bookService: BookService, private http: HttpClient) { }

  updateBook() {
    const formData = new FormData();
    formData.append('title', this.book.title);
    formData.append('author', this.book.author);
    formData.append('price', this.book.price.toString());
  
    const coverPicInput = document.querySelector('input[name="coverPic"]');
    if (coverPicInput instanceof HTMLInputElement && coverPicInput.files?.length) {
      formData.append('coverPic', coverPicInput.files[0]);
    }
  
    formData.append('pages', this.book.pages.toString());
    formData.append('rating', this.book.rating.toString());
    formData.append('availableQuantity', this.book.availableQuantity.toString());
    formData.append('language', this.book.language);
    formData.append('genre', this.book.genre);
    formData.append('description', this.book.description);
  
    const pdfVersionInput = document.querySelector('input[name="pdfVersion"]');
    if (pdfVersionInput instanceof HTMLInputElement && pdfVersionInput.files?.length) {
      formData.append('pdfVersion', pdfVersionInput.files[0]);
    }
  
    this.http.put<any>('http://127.0.0.1:3000/api/books/'+ this.book._id, formData).subscribe(
      (response) => {
        console.log(response);
       window.confirm('The Book Was Successfully created.');
        // this.dialogRef.close();
      },
      (error) => {
        console.error(error);
         window.confirm('There was an error creating the book.');
      }
    );
  }

  updateBook2() {
    // Retrieve the form data
    const formData = new FormData();
     

    
    // Add other form fields
  
    // Check if a PDF file was selected
    const pdfFileInput = document.querySelector('input[name="pdfVersion"]') as HTMLInputElement;
    if (pdfFileInput && pdfFileInput.files && pdfFileInput.files.length > 0) {
      formData.append('pdfVersion', pdfFileInput.files[0]);
    }
    const coverPicInput = document.querySelector('input[name="coverPic"]');
    if (coverPicInput instanceof HTMLInputElement && coverPicInput.files?.length) {
      formData.append('coverPic', coverPicInput.files[0]);
    }
    // Make the API request to update the book
    this.http.put<any>('http://127.0.0.1:3000/api/books/' + this.book._id, this.book).subscribe(
      (response) => {
        console.log( "update ", response);
        const confirmDelete = window.confirm('The book was updated created.');
         //refresh the page
          window.location.reload();
      },
      (error) => {
        console.error( "error ",error);
        const confirmDelete = window.confirm('There was an error updating the book.');
      }
    );
  }
  
}
