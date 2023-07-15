import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Book } from '../models/book';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.Service';

@Injectable({
  providedIn: 'root'
})

export class CommentService {
    deleteComment(commentId: string) {
        return this.http.delete<any>('http://127.0.0.1:3000/api/comments/' + commentId);
    
    }
    addComment(_id: string, newComment: string): Observable<any> {
      //post commment to api {"book" : "648f3dfec2f1cafb918c8422","user" : "648f3dfec2f1cafb918c8422","text" : "text"} 
        return this.http.post<any>('http://127.0.0.1:3000/api/comments', { book: _id, user: this.userService.user._id, text: newComment });
    }
    updateComment(_id: string,comment: any): Observable<any> {
        return this.http.put<any>('http://127.0.0.1:3000/api/comments', { id: _id,  text: comment });
    }



    constructor(private http: HttpClient, public userService: UserService) { }
   //add observable getCommentsByBookId 
    getCommentsByBookId(bookId: string): Observable<any[]> {
        return this.http.get<any[]>('http://127.0.0.1:3000/api/comments/book/' + bookId);

    }


}