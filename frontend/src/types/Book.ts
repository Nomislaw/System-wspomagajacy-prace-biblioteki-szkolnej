export interface Book {
  id: number;
  title: string;
  publicationYear: number;
  isbn: string;

  authorId: number;
  author?: Author; 
  publisherId: number;
  publisher?: Publisher;
  categoryId: number;
  category?: Category;

  copies?: Copy[];
  reviews?: Review[];
}


export interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Publisher {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Copy {
  id: number;
  isAvailable: boolean;
}

export interface Review {
  id: number;
  userId: number;
  userName?: string;
  content: string;
  rating: number;
}
