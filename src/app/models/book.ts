export interface Book {
    _id: string;
    title: string;
    author: string;
    price: number;
    cover: string;
    pages: number;
    rating: number;
    discount: number;
    availableQuantity : number;
    language: string;
    genre: string;
    description: string;
    comments: string[];
    likes: string[];
    createdAt?: Date;
    updatedAt?: Date;
    quantity: number; // Add the quantity property to the Book model
  }
  

  