import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { DailyEntry } from "../../../generated/client";
import strings from "../../../localization/strings";

/**
 * Component properties
 */
interface Props {
  dailyEntries: DailyEntry[];
  setSelectedEntries: (selectedEntries: DailyEntry[]) => void;
  today: DateTime;
}

/**
 * Date range picker object.
 */
export interface Range {
  start: DateTime | null;
  end: DateTime | null;
}

/**
 * Date Range Picker component associated with multi bar chart.
 *
 * @param props Component properties
 * @returns Two date pickers enabling the selection of date range.
 */
const DateRangePicker = (props: Props) => {
  const { setSelectedEntries, dailyEntries, today } = props;

  const [range, setRange] = useState<Range>({
    start: today.minus({ days: 7 }),
    end: today
  });

  /**
   * Runs a for-loop that goes through the selected days, then sets entries from those days into a state to be displayed in the multi bar chart.
   * Filters null entries, commonly weekends.
   */
  const getDateRangeEntries = () => {
    if (range.start && range.end) {
      const selectedDays = range.end.diff(range.start, "days").toObject();
      const result = [];

      for (let i = 0; selectedDays.days && i <= selectedDays.days; i++) {
        result.push(
          dailyEntries.filter((item) => {
            return (
              item.logged !== 0 &&
              item.expected !== 0 &&
              DateTime.fromJSDate(item.date).toISODate() ===
                range.start?.plus({ days: i }).toISODate()
            );
          })[0]
        );
      }
      setSelectedEntries(result.filter((item) => item));
    }
  };

  useEffect(() => {
    getDateRangeEntries();
  }, [range]);

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
