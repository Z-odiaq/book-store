export interface Coupon {
    _id: string; // Unique identifier for the coupon
    code: string; // Coupon code
    discountPercentage: number; // Discount percentage (e.g., 10, 20, 30)
    expiryDate: string; // Expiry date in string format (e.g., "2023-12-31T00:00:00.000Z")
    currentUses: number; // Current number of times the coupon has been used
    maxUses: number; // Maximum number of times the coupon can be used
    __v?: number; // Version key used by the backend (optional)
    updatedAt?: string; // Last update date in string format (optional)
    users?: any[]; // List of users who have used the coupon (optional)
    createdAt?: string; // Creation date in string format (optional)
  }
  