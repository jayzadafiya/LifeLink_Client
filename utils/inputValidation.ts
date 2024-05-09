import { Experience, Qualification, TimeSlot } from "../interfaces/Doctor";

// Validation function for required fields
export const validateRequired = (value: string): boolean => {
  return value?.trim() !== "";
};

// Validation function for email format
export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

// Validation function for password format
export const vaildatePassword = (password: string): boolean => {
  const re =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{4,}/;

  return re.test(password);
};

// Validation function for phone number
export const validatePhone = (phone: string): boolean => {
  const re = /^[0-9]{10}$/; // Assumes a 10-digit phone number
  return re.test(phone);
};

// Validation function for bio length
export const validateBio = (bio: string): boolean => {
  return bio.trim().length <= 100;
};

// Validation function for address length
export const validateAddress = (address: string): boolean => {
  return address.trim().length <= 100;
};

// Validation function for about length
export const validateAbout = (about: string): boolean => {
  return about.trim().length <= 1000;
};

// Validation function for date
export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);

  // Check if the created Date object is invalid or if the provided dateString doesn't match the created Date object
  return (
    !isNaN(date.getTime()) && dateString === date.toISOString().slice(0, 10)
  );
};

// Validation function for end date
export const validateEndDate = (endDate: string): boolean => {
  const date = new Date(endDate);
  const currentDate = new Date();

  if (date > currentDate) {
    return false;
  }

  return true;
};

// Validation function for qualifications
export const validateQualifications = (
  qualifications: Qualification[]
): boolean => {
  return qualifications.every((item) => {
    return (
      item.startingDate.trim() !== "" &&
      item.endingDate.trim() !== "" &&
      item.degree.trim() !== "" &&
      item.university.trim() !== ""
    );
  });
};

// Validation function for experiences
export const validateExperiences = (experiences: Experience[]): boolean => {
  return experiences.every((item) => {
    return (
      item.startingDate.trim() !== "" &&
      item.endingDate.trim() !== "" &&
      item.position.trim() !== "" &&
      item.place.trim() !== ""
    );
  });
};

// Validation function for time slots
export const validateTimeSlots = (timeSlots: TimeSlot[]): boolean => {
  return timeSlots.every((item) => {
    return (
      item.slot.trim() !== "" &&
      item.appointments_time !== 0 &&
      item.startingTime.trim() !== "" &&
      item.endingTime.trim() !== ""
    );
  });
};

// Validation function for birthDate
export const validateDOB = (dob: string): boolean => {
  const dateOfBirth = new Date(dob);
  const currentDate = new Date();

  const differenceMs = currentDate.getTime() - dateOfBirth.getTime();

  // Convert the difference to years
  const differenceYears = differenceMs / (1000 * 60 * 60 * 24 * 365);

  return differenceYears >= 18 && differenceYears <= 65;
};
