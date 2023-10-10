import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction } from "react";
import { getTimeDifferenceInDays } from "../../utils/time-utils";

/**
 * Component properties
 */
interface Props {
  dateTimeNow: DateTime;
  setDates: (startDate: DateTime | undefined, endDate: DateTime | undefined, days: number) => void;
  startDate: DateTime;
  endDate: DateTime;
  setStartDate: Dispatch<SetStateAction<DateTime>>;
  setEndDate: Dispatch<SetStateAction<DateTime>>;
}
/**
 * Date range picker component
 *
 * @param props DateRangePickerProps
 */
const DateRangePicker = ({
  dateTimeNow,
  setDates,
  endDate,
  setEndDate,
  setStartDate,
  startDate
}: Props) => {
  /**
   * Handle date change and calculate days
   *
   * @returns startDate, endDate, days
   */
  const handleDateChange = (startDate: DateTime, endDate: DateTime) => {
    if (startDate) {
      setStartDate(startDate);
    }
    if (endDate) {
      setEndDate(endDate);
    }
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
