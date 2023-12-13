import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { getVacationDurationInDays } from "../../utils/time-utils";
import strings from "../../localization/strings";

/**
 * Component properties
 */
interface Props {
  dateTimeTomorrow: DateTime;
  setDates: (startDate: DateTime, endDate: DateTime, days: number) => void;
  startDate: DateTime;
  endDate: DateTime;
  setStartDate: (startDate: DateTime) => void;
  setEndDate: (endDate: DateTime) => void;
}
/**
 * Date range picker component
 *
 * @param props DateRangePickerProps
 */
const DateRangePicker = ({
  dateTimeTomorrow,
  setDates,
  endDate,
  setEndDate,
  setStartDate,
  startDate
}: Props) => {
  /**
   * Handle date change and calculate days
   *
   * @param props startDate, endDate, days
   */
  const handleDateChange = (startDate: DateTime, endDate: DateTime) => {
    const updatedEndDate = startDate > endDate ? startDate : endDate;
    setStartDate(startDate);
    setEndDate(updatedEndDate);
    setDates(startDate, updatedEndDate, getVacationDurationInDays(startDate, updatedEndDate));
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
        label={strings.vacationRequest.startDate}
        value={startDate}
        minDate={dateTimeTomorrow}
        onChange={(newValue: DateTime | null) => newValue && handleDateChange(newValue, endDate)}
      />
      <DatePicker
        sx={{ width: "100%", padding: "0 0 0 5px" }}
        label={strings.vacationRequest.endDate}
        value={endDate}
        minDate={startDate}
        onChange={(newValue: DateTime | null) => newValue && handleDateChange(startDate, newValue)}
      />
    </Box>
  );
};

export default DateRangePicker;
