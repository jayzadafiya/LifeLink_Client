import { Doctor, PrescriptionFormData } from "../interfaces/Doctor";
import {
  DoctorForm,
  DonorForm,
  LoginForm,
  NestedDoctorForm,
  PrescriptionForm,
  RequestMessageForm,
  SignupForm,
  UpdatePasswordForm,
  UserForm,
  ValidationErrors,
} from "../interfaces/Forms";
import {
  vaildatePassword,
  validateAbout,
  validateAddress,
  validateBio,
  validateDOB,
  validateDate,
  validateEmail,
  validateEndDate,
  validateExperiences,
  validateMedicine,
  validatePhone,
  validateQualifications,
  validateRequired,
  validateStringArray,
  validateTimeSlots,
} from "./inputValidation";

// Doctor Form validation function
export const doctorValidateForm = (formData: any): Partial<DoctorForm> => {
  const newErrors: Partial<DoctorForm> = {};
  const {
    name,
    email,
    about,
    fees,
    phone,
    bio,
    gender,
    address,
    timeSlots_data,
    experiences,
    qualifications,
    specialization,
  } = formData;

  if (!validateRequired(name)) {
    newErrors.name = "Name is required";
  }

  if (!validateRequired(email)) {
    newErrors.email = "Email is required";
  } else if (!validateEmail(email)) {
    newErrors.email = "Invalid email format";
  }

  if (!validatePhone(phone)) {
    newErrors.phone = "Invalid phone number";
  }
  if (!fees) {
    newErrors.fees = "Fees is required";
  } else if (fees === 0) {
    newErrors.fees = "Fess should be greater than Zero";
  }

  if (!validateRequired(bio)) {
    newErrors.bio = "Bio is required";
  } else if (!validateBio(bio)) {
    newErrors.bio = "Bio should be less than 100 characters";
  }

  if (!validateRequired(address)) {
    newErrors.address = "Address is required";
  } else if (!validateAddress(address)) {
    newErrors.address = "Address should be less than 100 characters";
  }

  if (!validateRequired(specialization)) {
    newErrors.specialization = "specialization is required";
  }

  if (!validateRequired(gender)) {
    newErrors.gender = "Gender is required";
  }

  if (!validateQualifications(qualifications)) {
    newErrors.qualifications = "All qualification fields are required";
  }

  if (!validateExperiences(experiences)) {
    newErrors.experiences = "All experience fields are required";
  }

  if (!validateTimeSlots(timeSlots_data)) {
    newErrors.timeSlots_data = "All time slot fields are required";
  }

  if (!validateRequired(about)) {
    newErrors.about = "About is required";
  } else if (!validateAbout(about)) {
    newErrors.about = "About is required";
  }

  return newErrors;
};

// Doctor Profile page handelInput form validation
export const handleNestedInputValidation = (
  formData: NestedDoctorForm,
  index: number,
  key: string
): ValidationErrors => {
  const error: ValidationErrors = {};
  const {
    degree,
    university,
    place,
    position,
    startingDate,
    endingDate,
    slot,
    appointments_time,
    startingTime,
    endingTime,
  } = formData;

  if (key !== "timeSlots_data") {
    if (!validateRequired(startingDate)) {
      error.startingDate = { message: "Starting date is required", index, key };
    } else if (!validateDate(startingDate)) {
      error.startingDate = { message: "Starting date is invalid", index, key };
    }

    if (!validateRequired(endingDate)) {
      error.endingDate = { message: "Ending date is required", index, key };
    } else if (!validateDate(endingDate)) {
      error.endingDate = { message: "Ending date is invalid", index, key };
    } else if (!validateEndDate(endingDate)) {
      error.endingDate = {
        message: "Ending date is greater than Current date",
        index,
        key,
      };
    }
  }

  if (key === "qualifications") {
    if (!validateRequired(degree)) {
      error.degree = { message: "Degree is required", index };
    }
    if (!validateRequired(university)) {
      error.university = { message: "University is required", index };
    }
  } else if (key === "experiences") {
    if (!validateRequired(place)) {
      error.place = { message: "place is required", index };
    }

    if (!validateRequired(position)) {
      error.position = { message: "Position  is required", index };
    }
  }
  if (key === "timeSlots_data") {
    if (!validateRequired(slot)) {
      error.slot = { message: "slot is required", index };
    }

    if (isNaN(appointments_time)) {
      error.appointments_time = {
        message: "appointment time is required",
        index,
      };
    } else if (appointments_time < 5 || appointments_time > 60) {
      error.appointments_time = { message: "5 <= time <=60", index };
    }

    if (!validateRequired(startingTime)) {
      error.startingTime = {
        message: "Start Time is required",
        index,
        key,
      };
    }

    if (!validateRequired(endingTime)) {
      error.endingTime = {
        message: "End Time is required",
        index,
        key,
      };
    }
  }
  return error;
};

// Signup form validation
export const signupFormvalidation = (
  formData: SignupForm
): Partial<SignupForm> => {
  const { email, name, password, passwordConfirm, gender } = formData;

  let errors: Partial<SignupForm> = {};

  // Name validation
  if (!validateRequired(name)) {
    errors.name = "Name is required";
  }

  // Email validation
  if (!validateRequired(email)) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Email is invalid";
  }

  // Password filed validation
  if (!validateRequired(password)) {
    errors.password = "Password is required";
  } else if (password && password.length < 4) {
    errors.password = "Password must be at least 6 characters long";
  } else if (!vaildatePassword(password)) {
    errors.password =
      "Password must have at least one uppercase letter, one lowercase letter, one special character";
  }

  // password  validation
  if (password !== passwordConfirm) {
    errors.passwordConfirm = "Confirm password done not mathch with Passwords ";
  }

  // Gender filed validation
  if (!gender) {
    errors.gender = "Gender is required";
  }

  return errors;
};

// Login form validation
export const loginFormvalidation = (
  formData: LoginForm
): Partial<LoginForm> => {
  const { email, password } = formData;

  let errors: Partial<LoginForm> = {};

  // Email validation
  if (!validateRequired(email)) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Email is invalid";
  }

  // Password filed validation
  if (!validateRequired(password)) {
    errors.password = "Password is required";
  } else if (password && password.length < 4) {
    errors.password = "Password must be at least 6 characters long";
  } else if (!vaildatePassword(password)) {
    errors.password =
      "Password must have at least one uppercase letter, one lowercase letter, one special character";
  }

  return errors;
};

// Patient form validation
export const patientFormValidation = (
  formData: UserForm
): Partial<UserForm> => {
  const { email, name, gender, bloodType } = formData;
  const newErrors: Partial<UserForm> = {};

  if (!validateRequired(name)) {
    newErrors.name = "Name is required";
  }

  if (!validateRequired(email)) {
    newErrors.email = "Email is required";
  } else if (!validateEmail(email)) {
    newErrors.email = "Invalid email format";
  }

  if (!validateRequired(gender)) {
    newErrors.gender = "Gender is required";
  }

  if (!validateRequired(bloodType)) {
    newErrors.bloodType = "Blood Type is required";
  }

  return newErrors;
};

// Donor form validation
export const donorFormValidation = (
  formData: DonorForm
): Partial<DonorForm> => {
  const {
    email,
    name,
    gender,
    bloodType,
    phone,
    address,
    city,
    addharCard,
    dob,
    lastDonationDate,
    weight,
  } = formData;
  const newErrors: Partial<DonorForm> = {};

  if (!validateRequired(name)) {
    newErrors.name = "Name is required";
  }

  if (!validateRequired(email)) {
    newErrors.email = "Email is required";
  } else if (!validateEmail(email)) {
    newErrors.email = "Invalid email format";
  }

  if (!validateRequired(gender)) {
    newErrors.gender = "Gender is required";
  }

  if (!validateRequired(bloodType)) {
    newErrors.bloodType = "Blood Type is required";
  }

  if (!validateRequired(city)) {
    newErrors.city = "City is required";
  }

  if (!validateRequired(address)) {
    newErrors.address = "Address is required";
  } else if (!validateAddress(address)) {
    newErrors.address = "Address should be less than 100 characters";
  }

  if (!validatePhone(phone)) {
    newErrors.phone = "Invalid phone number";
  }

  if (!validateRequired(addharCard)) {
    newErrors.addharCard = "Addhar card number isrequierd";
  } else if (addharCard && addharCard.trim().length !== 12) {
    newErrors.addharCard = "Addhar card nummber length must be 12";
  }

  if (!validateRequired(dob)) {
    newErrors.dob = "Birth date is requierd";
  } else if (!validateDOB(dob)) {
    newErrors.dob = "Age limit is between 18 to 65 ";
  }

  if (lastDonationDate && !validateEndDate(lastDonationDate)) {
    newErrors.lastDonationDate = "Please enter correct Date";
  }

  if (!validateRequired(weight)) {
    newErrors.weight = "Weight is required!";
  } else if (weight && parseInt(weight) < 45) {
    newErrors.weight = "Minimum 45Kg weight required";
  }

  return newErrors;
};

// Request message form validation
export const requestFormValidation = (
  formData: RequestMessageForm
): Partial<RequestMessageForm> => {
  const { name, phone, address } = formData;
  const newErrors: Partial<RequestMessageForm> = {};

  if (!validateRequired(name)) {
    newErrors.name = "Name is required";
  }

  if (!validatePhone(phone)) {
    newErrors.phone = "Invalid phone number";
  }

  if (!validateRequired(address)) {
    newErrors.address = "Address is required";
  } else if (!validateAddress(address)) {
    newErrors.address = "Address should be less than 100 characters";
  }

  return newErrors;
};

// Prescription form validation
export const prescriptionFormValidation = (formData: PrescriptionFormData) => {
  const { test, medicine, advice, symptoms } = formData;

  const error: Partial<PrescriptionForm> = {};

  if (symptoms.length > 0 && !validateStringArray(symptoms)) {
    error.symptoms = "Please add Symptoms";
  }

  if (test.length > 0 && !validateStringArray(test)) {
    error.test = "Please add test";
  }

  if (advice.length > 0 && !validateStringArray(advice)) {
    error.advice = "Please add advice";
  }

  if (!validateMedicine(medicine)) {
    error.medicine = "Please add medicine data";
  }

  return error;
};

// Update password form validation
export const updatePasswordFormvalidation = (
  formData: UpdatePasswordForm
): Partial<UpdatePasswordForm> => {
  const { oldPassword, newPassword, confirmPassword } = formData;

  let errors: Partial<UpdatePasswordForm> = {};

  // oldPassword filed validation
  if (!validateRequired(oldPassword)) {
    errors.oldPassword = "oldPassword is required";
  } else if (oldPassword && oldPassword.length < 4) {
    errors.oldPassword = "oldPassword must be at least 6 characters long";
  } else if (!vaildatePassword(oldPassword)) {
    errors.oldPassword =
      "oldPassword must have at least one uppercase letter, one lowercase letter, one special character";
  }
  // newPassword filed validation
  if (!validateRequired(newPassword)) {
    errors.newPassword = "newPassword is required";
  } else if (newPassword && newPassword.length < 4) {
    errors.newPassword = "newPassword must be at least 6 characters long";
  } else if (!vaildatePassword(newPassword)) {
    errors.newPassword =
      "newPassword must have at least one uppercase letter, one lowercase letter, one special character";
  }

  if (newPassword !== confirmPassword) {
    errors.confirmPassword =
      "Confirm password done not mathch with New passwords ";
  }

  return errors;
};
