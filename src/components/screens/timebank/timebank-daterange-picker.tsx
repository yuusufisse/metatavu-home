import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
// import strings from "../../../localization/strings";
import { SelectChangeEvent } from "@mui/material";
import { PersonTotalTime, DailyEntry } from "../../../generated/client";

interface Props {
  personTotalTime: PersonTotalTime;
  personDailyEntry: DailyEntry;
  dailyEntries: DailyEntry[];
  timespanSelector: string;
  handleBalanceViewChange: (e: SelectChangeEvent) => void;
  handleDailyEntryChange: (e: DateTime | null) => void;
  disableNullEntries: (e: DateTime) => boolean;
}

interface Range {
  start: DateTime | null;
  end: DateTime | null;
}

const DateRangePicker = (props: Props) => {
  const {
    // personTotalTime,
    // personDailyEntry,
    // timespanSelector,
    // handleBalanceViewChange,
    // handleDailyEntryChange,
    dailyEntries,
    disableNullEntries
  } = props;

  const [range, setRange] = useState<Range>();
  console.log(range);

  useEffect(() => {
    if (range?.start && range?.end) {
      const selectedDays = range?.start.diff(range.end, "days").toObject();
      const result = [];
      for (let i = 0; i < selectedDays?.days; i++) {
        result.push(
          dailyEntries.filter((item) => {
            return (
              DateTime.fromJSDate(item.date).toLocaleString() ===
              range.end.plus({ days: i + 1 }).toLocaleString()
            );
          })[0]
        );
      }
      console.log(result);
    }
  }, [range]);

  return (
    <>
      <DatePicker
        sx={{
          width: "50%",
          marginLeft: "25%",
          marginRight: "25%",
          marginBottom: "1%"
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
          width: "50%",
          marginLeft: "25%",
          marginRight: "25%",
          marginBottom: "1%"
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
