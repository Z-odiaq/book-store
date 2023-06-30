//user model
export interface User {

    _id: string;
    firstname: String;
    lastname: String;
    phone: String;
    email: String;
    likedBooks: String[];
    purchased: String[];
    cart: [{
        book: {},
        quantity: {}
    }];
    favorites: String[];
    orders: String[];
    createdAt: Date;
    updatedAt: Date;
}