import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DailyEntry } from "../../../generated/client";

interface Props {
  dailyEntries: DailyEntry[];
  setSelectedEntries: Dispatch<SetStateAction<DailyEntry[] | undefined>>;
  disableNullEntries: (e: DateTime) => boolean;
}

interface Range {
  start: DateTime | null;
  end: DateTime | null;
}

const DateRangePicker = (props: Props) => {
  const { setSelectedEntries, dailyEntries, disableNullEntries } = props;

  const [range, setRange] = useState<Range>({
    start: DateTime.now(),
    end: DateTime.now()
  });

  /**
   * useEffect that triggers on DatePicker range changes.
   * Runs a for-loop that goes through the selected days, then sets entries from those days into a state to be displayed in the multi bar chart.
   * Filters null-entries, commonly weekends.
   */
  useEffect(() => {
    if (range.start && range.end) {
      const selectedDays = range?.end.diff(range.start, "days").toObject();
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
        value={DateTime.fromJSDate(dailyEntries[0].date)}
        minDate={DateTime.fromJSDate(dailyEntries[dailyEntries.length - 1].date)}
        maxDate={DateTime.fromJSDate(dailyEntries[0].date)}
        shouldDisableDate={disableNullEntries}
      />
      <DatePicker
        sx={{
          width: "24%",
          mx: "1%"
        }}
        label={"End"}
        disableFuture
        onChange={(dateTime) => setRange({ ...range, end: dateTime })}
        value={DateTime.fromJSDate(dailyEntries[0].date)}
        minDate={DateTime.fromJSDate(dailyEntries[dailyEntries.length - 1].date)}
        maxDate={DateTime.fromJSDate(dailyEntries[0].date)}
        shouldDisableDate={disableNullEntries}
      />
    </>
  );
};

export default DateRangePicker;
