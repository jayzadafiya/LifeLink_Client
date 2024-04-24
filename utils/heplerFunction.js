import jwt from "jsonwebtoken";

/**
 * Format a given date based on the provided configuration.
 *
 * @param {Date} date - The date object to format.
 * @param {Object} [config] - Configuration options for formatting.
 * @param {string} [config.format] - The format to use for formatting the date.
 * @returns {string} The formatted date string.
 */
export const formateDate = (date, config) => {
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
export const convertTime = (time) => {
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
 * @returns {object|null} The decoded payload, or null if decoding fails.
 */
export const decodeToken = (token) => {
  const data = jwt.decode(token);

  return data;
};

/**
 * Create time slots based on the provided configuration.
 *
 * @param {Object[]} slots - The array of slot configurations.
 * @param {string} slots[].slot - The slot name (e.g., 'morning', 'afternoon', 'evening').
 * @param {string} slots[].startingTime - The starting time of the slot (in HH:MM format).
 * @param {string} slots[].endingTime - The ending time of the slot (in HH:MM format).
 * @param {number} slots[].appointments_time - The time interval between appointments (in minutes).
 * @returns {Object[]} The array of generated time slots.
 */
export const createTimeSlot = (slots) => {
  let timeSlots = [];

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
export const timeslotGenerator = (start, end, time) => {
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
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes to HH:MM format.
 *
 * @param {number} minutes - The time in minutes.
 * @returns {string} The time string in HH:MM format.
 */
const minutesToTime = (minutes) => {
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
const validateTimeslot = (slot, startMinutes, endMinutes) => {
  const timeSlots = {
    morning: { start: "06:00", end: "12:00" },
    afternoon: { start: "12:00", end: "17:00" },
    evening: { start: "17:00", end: "21:00" },
  };

  const { start, end } = timeSlots[slot];
  const startTime = timeToMinutes(start);
  const endTime = timeToMinutes(end);

  if (startMinutes < startTime || endMinutes > endTime) {
    throw new Error("not valid");
  }
};

/**
 * Compare two time slots for equality.
 *
 * @param {Object} slot1 - The first time slot.
 * @param {string} slot1.slot - The slot name.
 * @param {string} slot1.startingTime - The starting time of the slot.
 * @param {string} slot1.endingTime - The ending time of the slot.
 * @param {number} slot1.appointments_time - The time interval between appointments.
 * @param {Object} slot2 - The second time slot to compare.
 * @returns {boolean} True if the time slots are equal, otherwise false.
 */
function compareTimeSlots(slot1, slot2) {
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
 * @param {Object[]} newData - The array of new time slots.
 * @param {Object[]} existingData - The array of existing time slots.
 * @returns {Object[]} The array of updated time slots.
 */
export function findUpdatedTimeSlots(newData, existingData) {
  const updatedSlots = [];

  newData.forEach((newSlot) => {
    const existingSlot = existingData.find((slot) =>
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
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Convert a date in ISOString format to a string in yyyy-mm-dd format.
 *
 * @param {string} newDateStr - The date in ISOString format.
 * @returns {string} The date string in yyyy-mm-dd format.
 */
export const dateToString = (newDateStr) => {
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
 * @param {Object[]} timeslots - The array of time slots.
 * @param {string} date - The date to exclude bookings for.
 * @returns {Object[]} The updated time slots with excluded bookings for the specified date.
 */
export const timeslotByDate = (timeslots, date) => {
  const newTimeslots = timeslots.map((slot) =>
    Object.keys(slot).reduce((newSlot, period) => {
      // Filter out slots that don't include the specified date
      const filteredData = slot[period].filter(({ bookingDate }) => {
        return !bookingDate.includes(date);
      });
      newSlot[period] = filteredData;
      return newSlot;
    }, {})
  );
  return newTimeslots;
};
