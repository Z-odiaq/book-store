export interface Order {
    _id: string;
    user: string;
    books: {
      book: string;
      quantity: number;
    }[];
    total: number;
    reductedPrice: number;
    number: string;
    retured: boolean;
    returnedDate: Date;
    returnedReason: string;
    status: string;
    couponCode: string;
    addresse: string;
    note: string;
    paymentMethod: string;
    createdAt: Date;
    updatedAt: Date;
  }
  