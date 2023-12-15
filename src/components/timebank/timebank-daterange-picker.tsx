import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { DailyEntry } from "../../generated/client";
import strings from "../../localization/strings";
import { DateRange } from "../../types";

/**
 * Component properties
 */
interface Props {
  dailyEntries: DailyEntry[];
  setSelectedEntries: (selectedEntries: DailyEntry[]) => void;
  today: DateTime;
}

/**
 * Date Range Picker component
 *
 *
 * @param props Component properties
 */
const DateRangePicker = ({ setSelectedEntries, dailyEntries, today }: Props) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: today.minus({ days: 7 }),
    end: today
  });

  useEffect(() => {
    getDateRangeEntries();
  }, [dateRange]);

  /**
   * Gets daily entries within time dateRange
   * Filters null entries, commonly weekends.
   */
  const getDateRangeEntries = () => {
    if (dateRange.start && dateRange.end) {
      const selectedDays = dateRange.end.diff(dateRange.start, "days").toObject();
      const result = [];

      for (let i = 0; selectedDays.days && i <= selectedDays.days; i++) {
        result.push(
          dailyEntries.filter(
            (item) =>
              item.logged &&
              item.expected &&
              DateTime.fromJSDate(item.date).toISODate() ===
                dateRange.start?.plus({ days: i }).toISODate()
          )[0]
        );
      }
      setSelectedEntries(result.filter((item) => item));
    }
  };

  return (
    <>
      <DatePicker
        sx={{
          width: "24%",
          mx: "1%"
        }}
        label={strings.timeExpressions.startDate}
        onChange={(dateTime: DateTime | null) =>
          dateTime && setDateRange({ ...dateRange, start: dateTime })
        }
        value={dateRange.start}
        maxDate={dateRange.end?.minus({ days: 1 })}
      />
      <DatePicker
        sx={{
          width: "24%",
          mx: "1%"
        }}
        label={strings.timeExpressions.endDate}
        onChange={(dateTime: DateTime | null) =>
          dateTime && setDateRange({ ...dateRange, end: dateTime })
        }
        value={dateRange.end}
        minDate={dateRange.start?.plus({ days: 1 })}
      />
    </>
  );
};

export default DateRangePicker;
