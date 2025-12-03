export interface User {
  id: string;
  username?: string;
  email: string;
  imagePath?: string;
  createdAt?: Date;
}

export interface UserUpdate {
  id: string;
  username?: string;
  email: string;
  imageId?: string;
}