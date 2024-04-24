import {
  vaildatePassword,
  validateAbout,
  validateAddress,
  validateBio,
  validateDate,
  validateEmail,
  validateEndDate,
  validateExperiences,
  validatePhone,
  validateQualifications,
  validateRequired,
  validateTimeSlots,
} from "./inputValidation";

// Doctor Form validation function
export const doctorValidateForm = (formData) => {
  const newErrors = {};
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
  if (fees === "") {
    newErrors.fees = "Fees is required";
  } else if (fees === "0") {
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
export const handleInputValidation = (formData, index, key) => {
  const error = {};
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
export const signupFormvalidation = (formData) => {
  const { email, name, password, passwordConfirm, gender } = formData;

  let errors = {};

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
  } else if (password.length < 4) {
    errors.password = "Password must be at least 6 characters long";
  } else if (!vaildatePassword(password)) {
    errors.password =
      "Password must have at least one uppercase letter, one lowercase letter, one special character";
  }

  // password  validation
  if (password !== passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match";
  }

  // Gender filed validation
  if (gender) {
    errors.gender = "Gender is required";
  }

  return errors;
};

// Login form validation
export const loginFormvalidation = (formData) => {
  const { email, password } = formData;

  let errors = {};

  // Email validation
  if (!validateRequired(email)) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Email is invalid";
  }

  // Password filed validation
  if (!validateRequired(password)) {
    errors.password = "Password is required";
  } else if (password.length < 4) {
    errors.password = "Password must be at least 6 characters long";
  } else if (!vaildatePassword(password)) {
    errors.password =
      "Password must have at least one uppercase letter, one lowercase letter, one special character";
  }

  return errors;
};

// Patient form validation
export const patientFormValidation = (formData) => {
  const { email, name, gender, bloodType } = formData;
  const newErrors = {};

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
