import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { getTimeDifferenceInDays } from "../../utils/time-utils";

/**
 * Component properties
 */
interface Props {
  dateTimeNow: DateTime;
  setDates: (startDate: DateTime | undefined, endDate: DateTime | undefined, days: number) => void;
  initialStartDate?: DateTime;
  initialEndDate?: DateTime;
}
/**
 * Date range picker component
 *
 * @param props DateRangePickerProps
 */
const DateRangePicker = ({ dateTimeNow, setDates, initialStartDate, initialEndDate }: Props) => {
  const [startDate, setStartDate] = useState<DateTime>(
    initialStartDate ? initialStartDate : dateTimeNow
  );
  const [endDate, setEndDate] = useState<DateTime>(initialEndDate ? initialEndDate : dateTimeNow);

  /**
   * Set startDate and endDate on initial dates changing
   */
  useEffect(() => {
    if (initialStartDate) {
      setStartDate(initialStartDate);
    } else {
      setStartDate(dateTimeNow);
    }
    if (initialEndDate) {
      setEndDate(initialEndDate);
    } else {
      setEndDate(dateTimeNow);
    }
  }, [initialStartDate, initialEndDate]);

  /**
   * Handle date change and calculate days
   *
   * @returns startDate, endDate, days
   */
  const handleDateChange = (startDate: DateTime | undefined, endDate: DateTime | undefined) => {
    if (startDate) {
      setStartDate(startDate);
    }
    if (endDate) {
      setEndDate(endDate);
    }
    let days = getTimeDifferenceInDays(startDate, endDate);
    if ((days && days < 1) || !days) {
      days = 1;
    } else {
      days += 1;
    }
    setDates(startDate, endDate, days);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignContent: "center",
        alignItems: "center"
      }}
    >
      <DatePicker
        sx={{ width: "100%", padding: "0 5px 0 0" }}
        label="Start Date"
        value={startDate}
        minDate={dateTimeNow}
        onChange={(newValue: DateTime | null) =>
          newValue && handleDateChange(newValue, newValue > endDate ? newValue : endDate)
        }
      />
      <DatePicker
        sx={{ width: "100%", padding: "0 0 0 5px" }}
        label="End Date"
        value={endDate}
        minDate={startDate}
        onChange={(newValue: DateTime | null) => newValue && handleDateChange(startDate, newValue)}
      />
    </Box>
  );
};

export default DateRangePicker;
