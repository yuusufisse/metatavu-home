import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { DailyEntry } from "../../generated/client";
import { Range } from "../../types";
import strings from "../../localization/strings";

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
 */
const DateRangePicker = (props: Props) => {
  const { setSelectedEntries, dailyEntries, today } = props;

  const [range, setRange] = useState<Range>({
    start: today.minus({ days: 7 }),
    end: today
  });

  useEffect(() => {
    getDateRangeEntries();
  }, [range]);

  /**
   * Gets daily entries within time range
   * Filters null entries, commonly weekends.
   */
  const getDateRangeEntries = () => {
    if (range.start && range.end) {
      const selectedDays = range.end.diff(range.start, "days").toObject();
      const result = [];

      for (let i = 0; selectedDays.days && i <= selectedDays.days; i++) {
        result.push(
          dailyEntries.filter(
            (item) =>
              item.logged &&
              item.expected &&
              DateTime.fromJSDate(item.date).toISODate() ===
                range.start?.plus({ days: i }).toISODate()
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
        onChange={(dateTime) => setRange({ ...range, start: dateTime })}
        value={range.start}
        maxDate={range.end?.minus({ days: 1 })}
      />
      <DatePicker
        sx={{
          width: "24%",
          mx: "1%"
        }}
        label={strings.timeExpressions.endDate}
        onChange={(dateTime) => setRange({ ...range, end: dateTime })}
        value={range.end}
        minDate={range.start?.plus({ days: 1 })}
      />
    </>
  );
};

export default DateRangePicker;
