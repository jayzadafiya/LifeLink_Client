export interface DoctorForm {
  name: string;
  email: string;
  about: string;
  fees: string;
  phone: string;
  bio: string;
  gender: string;
  address: string;
  timeSlots_data: string;
  experiences: string;
  qualifications: string;
  specialization: string;
}

export interface NestedDoctorForm {
  degree: string;
  university: string;
  place: string;
  position: string;
  startingDate: string;
  endingDate: string;
  slot: string;
  appointments_time: number;
  startingTime: string;
  endingTime: string;
}

interface ErrorObject {
  message: string;
  index: number;
  key?: string;
}

export interface ValidationErrors {
  [key: string]: ErrorObject;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface AdminLoginForm {
  email: string;
  password: string;
  secretKey?: string;
  browser?: string;
  device?: string;
  os?: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  photo?: File | null;
  gender: string;
  role: string;
  passwordConfirm: string;
}

export interface UserForm {
  name: string;
  email: string;
  photo: string | null;
  gender: string;
  bloodType: string;
  phone: string;
}

export interface DonorForm {
  _id: string;
  dob: string;
  city: string;
  name: string;
  email: string;
  phone: string;
  weight: number | string;
  gender: string;
  address: string;
  disease?: string;
  styling?: string;
  surgery?: string;
  bloodType: string;
  addharCard: string;
  lastDonationDate?: string;
}

export interface DonorSearchForm {
  bloodType?: string;
  city?: string;
  address?: string;
}

export interface RequestMessageForm {
  name: string;
  address: string;
  phone: string;
  message?: string;
}

export interface PrescriptionForm {
  symptoms: string;
  advice: string;
  test: string;
  medicine: string;
}

export interface UpdatePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ContactForm {
  email: string;
  subject: string;
  message: string;
}
