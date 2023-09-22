import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useState } from "react";

interface DateRangePickerProps {
  dateTimeNow: DateTime;
  setDates: Function;
}
/**
 * Date range picker
 * Handles date change and day difference between start and end
 *
 * @props DateRangePickerProps
 */
const DateRangePicker = (props: DateRangePickerProps) => {
  const { dateTimeNow, setDates } = props;
  const [startDate, setStartDate] = useState<DateTime | null | undefined>(dateTimeNow);
  const [endDate, setEndDate] = useState<DateTime | null | undefined>(dateTimeNow);

  /**
   * Calculate time difference between startDate and endDate and assign it to days,
   * and set endDate as startDate if startDate is ahead of endDate,
   * and set days to 1 if startDate and endDate are equal
   *
   * @returns startDate, endDate, days
   */
  const handleDateChange = (
    startDate: DateTime | null | undefined,
    endDate: DateTime | null | undefined
  ) => {
    let days;
    let tempEndDate = endDate;
    if (startDate && endDate) {
      if (startDate > endDate) {
        tempEndDate = startDate;
      }
      if (startDate === endDate) {
        days = 1;
      } else {
        const diff = endDate.diff(startDate, ["days"]);
        days = Number(Math.round(diff.days)) + 1;
        if (days < 1) {
          days = 1;
        }
      }
    }
    setStartDate(startDate);
    setEndDate(tempEndDate);
    setDates(startDate, tempEndDate);
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
