import jwt from "jsonwebtoken";

export const formateDate = (date, config) => {
  const defaultOption = { day: "numeric", month: "short", year: "numeric" };
  const option = config ? config : defaultOption;

  return new Date(date).toLocaleDateString("en-US", option);
};

export const convertTime = (time) => {
  //timeParts will return an array
  const timeParts = time.split(":");

  let hours = parseInt(timeParts[0]);
  let min = parseInt(timeParts[1]);

  let meridiem = "am";

  if (hours >= 12) {
    meridiem = "pm";

    if (hours > 12) {
      hours -= 12;
    }
  }

  return (
    hours.toString().padStart(2) +
    ":" +
    min.toString().padStart(2, "0") +
    " " +
    meridiem
  );
};

export const decodeToken = (token) => {
  const data = jwt.decode(token);

  return data;
};
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

export const timeslotGenerator = (start, end, time) => {
  let timeslots = [];
  let currentMinute = start;

  while (currentMinute < end) {
    timeslots.push(minutesToTime(currentMinute));
    console.log(minutesToTime(currentMinute));
    currentMinute += time;
  }

  return timeslots;
};

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

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

//function for compare timeslots
function compareTimeSlots(slot1, slot2) {
  return (
    slot1.slot === slot2.slot &&
    slot1.appointments_time === slot2.appointments_time &&
    slot1.startingTime === slot2.startingTime &&
    slot1.endingTime === slot2.endingTime
  );
}

// Function to find updated time slots
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

//Make first word Capital
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

//Convert ISOString to string like yyyy-mm-dd
export const dateToString = (newDateStr) => {
  const date = new Date(newDateStr);

  date.setUTCHours(date.getUTCHours() + 5); // Add 5 hours for IST
  date.setUTCMinutes(date.getUTCMinutes() + 30); // Add 30 minutes for IST

  // Convert the date object to an ISO string
  const ISTDateString = date.toISOString().split("T")[0];

  return ISTDateString;
};

export const timeslotByDate = (timeslots, date) => {
  const newTimeslots = timeslots.map((slot) =>
    Object.keys(slot).reduce((newSlot, period) => {
      const filteredData = slot[period].filter(({ bookingDate }) => {
        return !bookingDate.includes(date);
      });
      newSlot[period] = filteredData;
      return newSlot;
    }, {})
  );
  return newTimeslots;
};
