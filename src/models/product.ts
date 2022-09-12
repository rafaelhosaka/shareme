import UserProfileEntity from "./userProfile";

export interface ProductEntity {
  id: string;
  title: string;
  description: string;
  dateCreated: Date;
  fileName: string;
  category: string;
  currency: string;
  price: number;
  user: UserProfileEntity;
}
