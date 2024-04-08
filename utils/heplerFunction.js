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
