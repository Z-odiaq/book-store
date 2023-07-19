
import { Component } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.Service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

  firstname: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(public userService: UserService) { }


}
