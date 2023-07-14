import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.Service';
import {DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.css']
})
export class PurchasedComponent implements OnInit{

  books: any[] = [];
  CurrPDFLink = '';
  constructor(private http: HttpClient, private userService : UserService,private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.http.get<any[]>('http://127.0.0.1:3000/api/books/purchased/'+ this.userService.user._id ).subscribe(
      (response) => {
        response.forEach((book) => {
          this.books.push(book);
          //remove duplicates 
          this.books = this.books.filter((book, index, self) =>{ 
            return index === self.findIndex((t) => ( t._id === book._id))
           })
        });
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }

  loadPDF(pdfUrl: string): void {
    this.CurrPDFLink = pdfUrl;
    }
    getSafeUrl(url: string): SafeResourceUrl {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.CurrPDFLink);
    }
  
}
