import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function Calander({
  onChange,
}: {
  onChange: (newDate: string) => void;
}): React.JSX.Element {
  const today = dayjs(new Date());
  const nextMonthSameDate = today.add(1, "month");
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        showDaysOutsideCurrentMonth
        fixedWeekNumber={5}
        minDate={today}
        maxDate={nextMonthSameDate}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
}
