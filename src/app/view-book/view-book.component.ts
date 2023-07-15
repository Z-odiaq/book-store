import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../models/book';
import { MatDialogRef } from '@angular/material/dialog';
import { BookService } from '../services/book.service';
import { UserService } from '../services/user.Service';
import { CommentService } from '../services/commentService';

@Component({
  selector: 'app-book-details',
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.css']
})
export class ViewBookComponent {
  book: Book = {} as Book;
  isLoading: boolean = true;
  loadingLikes: boolean = true;
  isFavorite: boolean = false;
  isLiked: boolean = false;
  comments: any[] = []; // Comment array
  newComment: string = '';
  likesCount: number = 0;
  EditComment: string = '';

  constructor(public commentService: CommentService, public bookService: BookService, public dialogRef: MatDialogRef<ViewBookComponent>, public userService: UserService) { }


  ngOnInit() {
    this.getBookById();
    this.checkFavorites();
    //this.getComments();
  }

  getComments() {

    console.log(this.book);
    return this.commentService.getCommentsByBookId(this.book._id).subscribe((comments: any[]) => {
      this.comments = comments;
    });
  }

  isCurrentUser(userId: string): boolean {
    return userId === this.userService.user?._id;
  }
  Cancel(comment: any): void {
    comment.editing = false;
  }
  // Function to edit a comment
  editComment(comment: any): void {
    // Set the 'editing' property of the comment to true
    comment.editing = true;
  }

  // Function to delete a comment
  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe((resp) => {
      this.comments = this.comments.filter(comment => comment._id !== commentId);
    });
  }



  saveComment(comment: any): void {
    if (this.EditComment === '') {
      return;
    }
    this.commentService.updateComment(comment._id, this.EditComment.trim()).subscribe((comment: any) => {
      this.comments = this.comments.map((c: any) => {
        if (c._id === comment._id) {
          c.text = comment.text;
        }
        return c;
      });
    });
    comment.editing = false;
  }


  checkFavorites() {
    this.userService.user?.favorites?.includes(this.book?._id) ? this.isFavorite = true : this.isFavorite = false;
  }
  //get book by the id
  getBookById() {
    return this.bookService.getBookById().subscribe((book: Book) => {
      this.book = book;
      this.commentService.getCommentsByBookId(book._id).subscribe((comments: any[]) => {
        this.comments = comments;
      });
      this.bookService.checkLiked(this.book._id).subscribe((isLiked: boolean) => {
        this.isLiked = isLiked;
        this.loadingLikes = false;
      });
      this.bookService.getLikesCount(this.book._id).subscribe((likesCount: number) => {
        console.log('likesCount', likesCount);
        this.likesCount = likesCount;
        this.loadingLikes = false;
      });
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



  addComment() {
    if (this.newComment) {
      this.commentService.addComment(this.book._id, this.newComment).subscribe((comment: any) => {
        this.comments.push(comment);
        this.newComment = '';
      });
    }
  }

  toggleLike() {
    if (this.isLiked) {
      this.likesCount--;
    } else {
      this.likesCount++;
    }
    this.isLiked = !this.isLiked;
    this.bookService.toggleLike(this.book._id);

  }
}
