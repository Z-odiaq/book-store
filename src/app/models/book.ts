export interface Book {
    _id: string;
    title: string;
    author: string;
    price: number;
    sold: number;
    cover: string;
    pages: number;
    rating: number;
    discount: number;
    availableQuantity : number;
    language: string;
    genre: string;
    PDFLink: string;
    description: string;
    comments: string[];
    likes: string[];
    createdAt?: Date;
    updatedAt?: Date;
    quantity: number; // Add the quantity property to the Book model
  }
  

  