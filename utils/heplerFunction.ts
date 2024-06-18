import jwt from "jsonwebtoken";
import {
  Appointment,
  SlotData,
  TimeSlot,
  TimeslotCreated,
  Timeslots,
} from "../interfaces/Doctor";
import dayjs from "dayjs";
import { PayLoad } from "../interfaces/User";
import { fileSize } from "./config";

/**
 * Format a given date based on the provided configuration.
 *
 * @param {string} date - The date object to format.
 * @param {Object} [config] - Configuration options for formatting.
 * @param {string} [config.format] - The format to use for formatting the date.
 * @returns {string} The formatted date string.
 */
export const formateDate = (date: string, config?: any): string => {
  const defaultOption = { day: "numeric", month: "short", year: "numeric" };
  const option = config ? config : defaultOption;

  return new Date(date).toLocaleDateString("en-US", option);
};

/**
 * Convert a time from 24-hour format to 12-hour format.
 *
 * @param {string} time - The time string to convert (in HH:MM format).
 * @returns {string} The time string in 12-hour format.
 */
export const convertTime = (time: string): string => {
  //timeParts will return an array
  const timeParts = time.split(":");

  let hours = parseInt(timeParts[0]);
  let min = parseInt(timeParts[1]);

  let meridiem = "am";

  // Converting to 12-hour format and setting the meridiem (am/pm)
  if (hours >= 12) {
    meridiem = "pm";

    if (hours > 12) {
      hours -= 12;
    }
  }

  // Returning the time in 12-hour format
  return (
    hours.toString().padStart(2) +
    ":" +
    min.toString().padStart(2, "0") +
    " " +
    meridiem
  );
};

/**
 * Decode a JWT token and retrieve the payload.
 *
 * @param {string} token - The JWT token to decode.
 * @returns {string|jwt.JwtPayload|null} The decoded payload, or null if decoding fails.
 */
export const decodeToken = (token: string): PayLoad => {
  const data = jwt.decode(token) as PayLoad;

  return data;
};

/**
 * Create time slots based on the provided configuration.
 *
 * @param {TimeSlot[]} slots - The array of slot configurations.
 * @param {string} slots[].slot - The slot name (e.g., 'morning', 'afternoon', 'evening').
 * @param {string} slots[].startingTime - The starting time of the slot (in HH:MM format).
 * @param {string} slots[].endingTime - The ending time of the slot (in HH:MM format).
 * @param {number} slots[].appointments_time - The time interval between appointments (in minutes).
 * @returns {TimeslotCreated[]} The array of generated time slots.
 */
export const createTimeSlot = (slots: TimeSlot[]): TimeslotCreated[] => {
  const timeSlots: TimeslotCreated[] = [];

  slots.forEach((item) => {
    const { slot, startingTime, endingTime, appointments_time } = item;
    const startMinutes = timeToMinutes(startingTime);
    const endMinutes = timeToMinutes(endingTime);

    validateTimeslot(slot, startMinutes, endMinutes);

    const generaterSLots = timeslotGenerator(
      startMinutes,
      endMinutes,
      appointments_time
    );

    timeSlots.push({ [slot]: generaterSLots });
  });

  return timeSlots;
};

/**
 * Generate time slots between the given start and end times.
 *
 * @param {number} start - The start time (in minutes).
 * @param {number} end - The end time (in minutes).
 * @param {number} time - The time interval between slots (in minutes).
 * @returns {string[]} The array of generated time slots.
 */
export const timeslotGenerator = (
  start: number,
  end: number,
  time: number
): string[] => {
  let timeslots = [];
  let currentMinute = start;

  while (currentMinute < end) {
    timeslots.push(minutesToTime(currentMinute));
    currentMinute += time;
  }

  return timeslots;
};

/**
 * Convert time from HH:MM format to minutes.
 *
 * @param {string} time - The time string to convert (in HH:MM format).
 * @returns {number} The time in minutes.
 */
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes to HH:MM format.
 *
 * @param {number} minutes - The time in minutes.
 * @returns {string} The time string in HH:MM format.
 */
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

/**
 * Validate if the given time slot falls within valid time ranges.
 *
 * @param {string} slot - The slot name.
 * @param {number} startMinutes - The starting time of the slot (in minutes).
 * @param {number} endMinutes - The ending time of the slot (in minutes).
 * @throws {Error} If the time slot is not valid.
 */
const validateTimeslot = (
  slot: string,
  startMinutes: number,
  endMinutes: number
) => {
  const timeSlotsPhase: { [key: string]: { start: string; end: string } } = {
    morning: { start: "06:00", end: "12:00" },
    afternoon: { start: "12:00", end: "17:00" },
    evening: { start: "17:00", end: "21:00" },
  };
  if (!(slot in timeSlotsPhase)) {
    throw new Error("Invalid time slot");
  }
  const { start, end } = timeSlotsPhase[slot];
  const startTime = timeToMinutes(start);
  const endTime = timeToMinutes(end);

  if (startMinutes < startTime || endMinutes > endTime) {
    throw new Error("Invalid time slot");
  }
};

/**
 * Compare two time slots for equality.
 *
 * @param {TimeSlot} slot1 - The first time slot.
 * @param {string} slot1.slot - The slot name.
 * @param {string} slot1.startingTime - The starting time of the slot.
 * @param {string} slot1.endingTime - The ending time of the slot.
 * @param {number} slot1.appointments_time - The time interval between appointments.
 * @param {TimeSlot} slot2 - The second time slot to compare.
 * @returns {boolean} True if the time slots are equal, otherwise false.
 */
function compareTimeSlots(slot1: TimeSlot, slot2: TimeSlot): boolean {
  return (
    slot1.slot === slot2.slot &&
    slot1.appointments_time === slot2.appointments_time &&
    slot1.startingTime === slot2.startingTime &&
    slot1.endingTime === slot2.endingTime
  );
}

/**
 * Find updated time slots from new and existing data.
 *
 * @param {TimeSlot[]} newData - The array of new time slots.
 * @param {TimeSlot[]} existingData - The array of existing time slots.
 * @returns {TimeSlot[]} The array of updated time slots.
 */
export function findUpdatedTimeSlots(
  existingData?: TimeSlot[],
  newData?: TimeSlot[]
): TimeSlot[] {
  const updatedSlots: TimeSlot[] = [];

  newData?.forEach((newSlot) => {
    const existingSlot = existingData?.find((slot) =>
      compareTimeSlots(newSlot, slot)
    );
    if (!existingSlot) {
      updatedSlots.push(newSlot);
    }
  });

  return updatedSlots;
}

/**
 * Capitalize the first letter of a string.
 *
 * @param {string} str - The input string.
 * @returns {string} The input string with the first letter capitalized.
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Convert a date in ISOString format to a string in yyyy-mm-dd format.
 *
 * @param {string} newDateStr - The date in ISOString format.
 * @returns {string} The date string in yyyy-mm-dd format.
 */
export const dateToString = (newDateStr: string): string => {
  const date = new Date(newDateStr);

  date.setUTCHours(date.getUTCHours() + 5); // Add 5 hours for IST
  date.setUTCMinutes(date.getUTCMinutes() + 30); // Add 30 minutes for IST

  // Convert the date object to an ISO string
  const ISTDateString = date.toISOString().split("T")[0];

  return ISTDateString;
};

/**
 * Convert time slots to exclude bookings for a specific date.
 *
 * @param {Timeslots[]} timeslots - The array of time slots.
 * @param {string} date - The date to exclude bookings for.
 * @returns {Timeslots[]} The updated time slots with excluded bookings for the specified date.
 */
export const timeslotByDate = (
  timeslots: Timeslots[],
  date: string
): Timeslots[] => {
  let now = new Date();

  // Convert to IST by adding 5 hours and 30 minutes
  let istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  let istDate = new Date(now.getTime() + istOffset);

  const newTimeslots: Timeslots[] = timeslots.map((slot) =>
    Object.keys(slot).reduce((newSlot, period: string) => {
      const currentDate = istDate.toISOString().split("T")[0];
      const currentTime = istDate.toISOString().split("T")[1];

      const Slots = slot[period as keyof Timeslots] as SlotData[];
      // Filter out slots that don't include the specified date
      const filteredData: string & SlotData[] = Slots.filter(
        ({ time, bookingDate }) => {
          // Filter out slots if the bookingDate is the specified date
          // Check if the specified date is included in the booking dates
          if (bookingDate.includes(date)) {
            return false;
          }
          // Check if the current date is included and the time is before or equal to the current time
          if (date === currentDate && time <= currentTime) {
            return false;
          }
          return true;
        }
      ) as string & SlotData[];

      newSlot[period as keyof Timeslots] = filteredData;

      return newSlot;
    }, {} as Timeslots)
  );
  return newTimeslots;
};

/**
 * Sorts appointments based on booking date and time in ascending or descending order.
 *
 * @param {Appointment[]} appointments - The array of appointments to be sorted.
 * @param {"asc" | "desc"} order - The order in which appointments should be sorted.
 * @returns {Appointment[]} The sorted array of appointments.
 */
export const sortedAppointments = (
  appointments: Appointment[],
  order: "asc" | "desc"
): Appointment[] => {
  const comparator = (a: Appointment, b: Appointment) => {
    const dateA = dayjs(a.bookingDate + " " + a.time);
    const dateB = dayjs(b.bookingDate + " " + b.time);

    if (order === "asc") {
      return dateA.diff(dateB);
    } else {
      return dateB.diff(dateA);
    }
  };

  return appointments.sort(comparator);
};

/**
 * Filters appointments based on a search term.
 *
 * @param {Appointment[]} sortedAppointments - The array of appointments to be filtered.
 * @param {string} searchTerm - The search term to filter appointments by doctor name.
 * @returns {Appointment[]} The filtered array of appointments.
 */
export const filteredAppointments = (
  sortedAppointments: Appointment[],
  searchTerm: string
): Appointment[] => {
  return sortedAppointments.filter((appointment) =>
    appointment.doctor.name.toLowerCase().includes(searchTerm?.toLowerCase())
  );
};

/**
 * Resizes an image to 330X330.
 *
 * @param {File} file - The image file to be resized.
 * @returns {Promise<Blob>} A promise that resolves with the resized image as a Blob(Binary Large OBject).
 */
export const resizeImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = fileSize;
      canvas.height = fileSize;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, fileSize, fileSize);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas is empty"));
          }
        },
        "image/jpeg",
        0.7
      );
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
