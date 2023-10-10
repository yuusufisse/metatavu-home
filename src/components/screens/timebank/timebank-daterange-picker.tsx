import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { DailyEntry } from "../../../generated/client";
import { Range } from "../timebank/timebank-content";

interface Props {
  dailyEntries: DailyEntry[];
  setSelectedEntries: (selectedEntries?: DailyEntry[]) => void;
  disableNullEntries: (e: DateTime, range?: Range) => boolean;
}

/**
 * Date Range Picker component associated with multi bar chart.
 */
const DateRangePicker = (props: Props) => {
  const { setSelectedEntries, dailyEntries, disableNullEntries } = props;

  const [range, setRange] = useState<Range>({
    start: DateTime.now().minus({ days: 1 }),
    end: DateTime.now()
  });

  /**
   * useEffect that triggers on DatePicker range changes.
   * Runs a for-loop that goes through the selected days, then sets entries from those days into a state to be displayed in the multi bar chart.
   * Filters null-entries, commonly weekends.
   */
  useEffect(() => {
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
      setSelectedEntries(result.filter((item) => item !== undefined));
    }
  }, [range]);

  useEffect(() => {
    setRange({
      ...range,
      start: DateTime.fromJSDate(dailyEntries[0].date).minus({ days: 7 }),
      end: DateTime.fromJSDate(dailyEntries[0].date)
    });
  }, []);

  return (
    <>
      <DatePicker
        sx={{
          width: "24%",
          mx: "1%"
        }}
        label={"Start"}
        disableFuture
        onChange={(dateTime) => setRange({ ...range, start: dateTime })}
        value={range.start}
        minDate={DateTime.fromJSDate(dailyEntries[dailyEntries.length - 1].date)}
        maxDate={DateTime.fromJSDate(dailyEntries[0].date)}
        shouldDisableDate={(day) => disableNullEntries(day, range)}
      />
      <DatePicker
        sx={{
          width: "24%",
          mx: "1%"
        }}
        label={"End"}
        disableFuture
        onChange={(dateTime) => setRange({ ...range, start: dateTime })}
        value={DateTime.fromJSDate(dailyEntries[0].date)}
        minDate={DateTime.fromJSDate(dailyEntries[dailyEntries.length - 1].date)}
        maxDate={DateTime.fromJSDate(dailyEntries[0].date)}
        shouldDisableDate={disableNullEntries}
      />
    </>
  );
};

export default DateRangePicker;
