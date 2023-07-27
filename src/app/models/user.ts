//user model
export interface User {

    _id: string;
    firstname: String;
    lastname: String;
    phone: String;
    email: String;
    likedBooks: String[];
    purchased: String[];
    role : String;
    password? : String;
    favorites: String[];
    orders: String[];
    createdAt: Date;
    updatedAt: Date;
}