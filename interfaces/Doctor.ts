import { User } from "./User";
import { ApprovalStatus } from "./enums";

export interface Qualification {
  startingDate: string;
  endingDate: string;
  degree: string;
  university: string;
}

export interface Experience {
  startingDate: string;
  endingDate: string;
  position: string;
  place: string;
}

export interface TimeSlot {
  slot: string;
  appointments_time: number;
  startingTime: string;
  endingTime: string;
}

export interface Doctor extends User {
  ticketPrice?: number;
  specialization?: string;
  bio?: string;
  about?: string;
  address?: string;
  fees: number;
  qualifications?: Qualification[];
  experiences?: Experience[];
  timeSlots_data?: TimeSlot[];
  reviews?: Review[];
  averageRating?: number;
  totalRating?: number;
  totalPatients?: number;
  isApproved?: ApprovalStatus;
}

export interface Appointment {
  _id: string;
  doctor: Doctor;
  user: User;
  fees: number;
  sessionCustomerId: string;
  time: string;
  bookingDate: string;
  status: ApprovalStatus;
  isPaid: boolean;
}

export interface SlotData {
  time: string;
  bookingDate: string;
}

export interface QTE extends Array<Qualification | TimeSlot | Experience> {}
// export interface Timeslots {
//   slotPhase: string;
//   slots: SlotData[];
// }
export interface Timeslots {
  [key: string]: SlotData[];
}

export interface TimeslotCreated {
  [key: string]: string[];
}

export interface Review {
  user: {
    name: string;
    photo: string;
  };
  createdAt: string;
  reviewText: string;
  rating: number;
}
