import { Doctor } from "./Doctor";
import { Gender } from "./enums";

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  photo?: string;
  role?: string;
  gender?: Gender | string;
  bloodType?: string;
}

export interface PayLoad {
  userId: string;
  email: string;
  role: string;
}

export interface ReviewData {
  reviewText: string;
  rating: number;
}

export interface Admin {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  doctors: Doctor[];
}
