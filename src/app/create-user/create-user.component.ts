
import { Component } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.Service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
errorMsg: any;
registerUser() { 
  if (this.password !== this.confirmPassword) {
    this.errorMsg = 'Passwords do not match';
    return;
  }
  const user: any = {
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    password: this.password,
    
  };
  this.userService.registerUser(user).subscribe((user: any) => {
    console.log(user);
    if (user?.token) {
      this.errorMsg = '';
      alert('User created successfully');
      //rload the page
      window.location.reload();
    }else if (user?.error){
      this.errorMsg = user.error;
    }else{
      this.errorMsg = 'Something went wrong';
    }
    console.log(user);
  });
}

  firstname: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(public userService: UserService) { }


}
