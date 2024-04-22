import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import strings from "src/localization/strings";
import { DateRange } from "src/types";

/**
 * Component properties
 */
interface Props {
  dateTimeTomorrow: DateTime;
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
}
/**
 * Date range picker component
 *
 * @param props DateRangePickerProps
 */
const DateRangePicker = ({ dateTimeTomorrow, dateRange, setDateRange }: Props) => {
  /**
   * Handle date change and calculate days
   *
   * @param props startDate, endDate, days
   */
  const handleDateChange = (startDate: DateTime, endDate: DateTime) => {
    const newEndDate = startDate > endDate ? startDate : endDate;
    setDateRange({
      start: startDate,
      end: newEndDate
    });
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
        value={dateRange.start}
        minDate={dateTimeTomorrow}
        onChange={(newValue: DateTime | null) =>
          newValue && handleDateChange(newValue, dateRange.end)
        }
      />
      <DatePicker
        sx={{ width: "100%", padding: "0 0 0 5px" }}
        label={strings.vacationRequest.endDate}
        value={dateRange.end}
        minDate={dateRange.start}
        onChange={(newValue: DateTime | null) =>
          newValue && handleDateChange(dateRange.start, newValue)
        }
      />
    </Box>
  );
};

export default DateRangePicker;
