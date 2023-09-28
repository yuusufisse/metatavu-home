import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { getTimeDifferenceInDays } from "../../utils/time-utils";

/**
 * Component properties
 */
interface DateRangePickerProps {
  dateTimeNow: DateTime;
  setDates: Function;
  initialStartDate?: DateTime;
  initialEndDate?: DateTime;
}
/**
 * Date range picker component
 *
 * @param props DateRangePickerProps
 */
const DateRangePicker = (props: DateRangePickerProps) => {
  const { dateTimeNow, setDates, initialStartDate, initialEndDate } = props;
  const [startDate, setStartDate] = useState<DateTime | null | undefined>(
    initialStartDate ? initialStartDate : dateTimeNow
  );
  const [endDate, setEndDate] = useState<DateTime | null | undefined>(
    initialEndDate ? initialEndDate : dateTimeNow
  );

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
   * Handle date change
   *
   * @returns startDate, endDate, days
   */
  const handleDateChange = (
    startDate: DateTime | null | undefined,
    endDate: DateTime | null | undefined
  ) => {
    if (startDate && endDate) {
      if (startDate > endDate) {
        setEndDate(startDate);
      } else setEndDate(endDate);
    }
    setStartDate(startDate);
    setDates(startDate, endDate, getTimeDifferenceInDays(startDate, endDate));
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
        onChange={(newValue) => handleDateChange(newValue, endDate)}
      />
      <DatePicker
        sx={{ width: "100%", padding: "0 0 0 5px" }}
        label="End Date"
        value={endDate}
        minDate={startDate}
        onChange={(newValue) => handleDateChange(startDate, newValue)}
      />
    </Box>
  );
};

export default DateRangePicker;
