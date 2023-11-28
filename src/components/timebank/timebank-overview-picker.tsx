import { DatePicker, DateView } from "@mui/x-date-pickers";
import { DateTime, DurationObjectUnits } from "luxon";
import { useEffect, useState } from "react";
import { PersonTotalTime, Timespan } from "../../generated/client";
import { Range } from "../../types";
import strings from "../../localization/strings";
import { Box, MenuItem, Select } from "@mui/material";
import { useAtomValue } from "jotai";
import { dailyEntriesAtom, timespanAtom } from "../../atoms/person";
import { getWeekFromISO } from "../../utils/time-utils";
/**
 * Component properties
 */
interface Props {
  totalTime: PersonTotalTime[];
  selectedTotalEntries: PersonTotalTime[];
  setSelectedTotalEntries: (selectedTotalEntries: PersonTotalTime[]) => void;
  today: DateTime;
  loading: boolean;
}

/**
 * Overview Range Picker component
 */
const OverviewRangePicker = (props: Props) => {
  const { setSelectedTotalEntries, totalTime, today, loading } = props;

  const dailyEntries = useAtomValue(dailyEntriesAtom);

  const earliestEntry = DateTime.fromJSDate(dailyEntries[dailyEntries.length - 1].date);

  const timespan = useAtomValue(timespanAtom);

  const [range, setRange] = useState<Range>({
    start: today.minus({ days: 7 }),
    end: today
  });

  const [weekRange, setWeekRange] = useState({
    start: "",
    end: ""
  });

  const startWeek = getWeekFromISO(
    weekRange.start?.split(",")[0],
    weekRange.start?.split(",")[2],
    range.start.weekday
  );
  const endWeek = getWeekFromISO(
    weekRange.end?.split(",")[0],
    weekRange.end?.split(",")[2],
    range.end.weekday
  );

  useEffect(() => {
    initializeWeekRange();

    //Remove initial values when component dismounts
    return () => {
      setWeekRange({
        start: "",
        end: ""
      });
    };
  }, [totalTime, range]);

  useEffect(() => {
    getOverviewRange();
  }, [timespan, range, totalTime, weekRange]);

  /**
   * Initializes default week values when selecting "By range -> Week"
   *
   */
  const initializeWeekRange = () => {
    if (timespan === Timespan.WEEK) {
      //TODO: Handle MUI out-of-range value warnings here

      setWeekRange({
        start: String(totalTime[3].timePeriod),
        end: String(totalTime[0].timePeriod)
      });
    }
  };

  /**
   * Render start week Select dropdown when week range is active
   *
   */
  const renderStartWeekSelect = () => {
    if (timespan !== Timespan.WEEK) return;

    if (range.start) {
      return (
        <Select
          label="Start week"
          sx={{ width: "8%", ml: "5px" }}
          value={weekRange.start}
          onChange={(e) => {
            const selectedValue = String(e.target.value);
            if (totalTime.some((entry) => entry.timePeriod === selectedValue)) {
              setWeekRange({ ...weekRange, start: selectedValue });
            }
          }}
        >
          {totalTime
            .filter(
              (entry) =>
                entry.timePeriod?.split(",")[0] === String(range.start?.year) &&
                entry.timePeriod?.split(",")[2] !== "0" &&
                getWeekFromISO(
                  entry.timePeriod?.split(",")[0],
                  entry.timePeriod?.split(",")[2],
                  range.start.weekday
                ) < endWeek
            ) //Filters the weeks outside the selected year and weeks starting with 0
            .map((entry) => (
              <MenuItem key={entry.timePeriod} value={entry.timePeriod}>
                {`${entry.timePeriod?.split(",")[2]}`}
              </MenuItem>
            ))}
        </Select>
      );
    }
  };

  /**
   * Render end week Select dropdown when week range is active
   *
   */
  const renderEndWeekSelect = () => {
    if (timespan !== Timespan.WEEK) return;

    if (range.end) {
      return (
        <Select
          label="End week"
          sx={{ width: "8%", ml: "5px" }}
          value={weekRange.end}
          onChange={(e) => {
            setWeekRange({ ...weekRange, end: String(e.target.value) });
          }}
        >
          {totalTime
            .filter(
              (entry) =>
                entry.timePeriod?.split(",")[0] === String(range.end?.year) &&
                entry.timePeriod?.split(",")[2] !== "0" &&
                getWeekFromISO(
                  entry.timePeriod?.split(",")[0],
                  entry.timePeriod?.split(",")[2],
                  range.start.weekday
                ) > startWeek
            )
            .map((entry) => (
              <MenuItem key={entry.timePeriod} value={entry.timePeriod}>
                {`${entry.timePeriod?.split(",")[2]}`}
              </MenuItem>
            ))}
        </Select>
      );
    }
  };

  /**
   * Gets total time from the selected time span.
   */
  const getOverviewRange = () => {
    if (range.start && range.end) {
      const result = [];
      let selectedRange: DurationObjectUnits;

      switch (timespan) {
        case Timespan.WEEK: {
          selectedRange = endWeek.diff(startWeek, "weeks").toObject();

          for (
            let i = 0;
            selectedRange.weeks && i <= Math.trunc(Number(selectedRange.weeks));
            i++
          ) {
            const week = `${startWeek.plus({ weeks: i }).get("year")},${startWeek
              .plus({ weeks: i })
              .get("month")},${startWeek.plus({ weeks: i }).get("weekNumber")}`;

            result.push(totalTime.find((item) => item.timePeriod === week));
          }
        }
        case Timespan.MONTH:
          selectedRange = range.end.diff(range.start, "months").toObject();
          for (
            let i = 0;
            selectedRange.months && i <= Math.trunc(Number(selectedRange.months));
            i++
          ) {
            const month = `${range.start?.plus({ months: i }).get("year")},${range.start
              ?.plus({ months: i })
              .get("month")}`;

            result.push(totalTime.find((item) => item.timePeriod === month));
          }
        case Timespan.YEAR:
          selectedRange = range.end.diff(range.start, "year").toObject();
          for (
            let i = 0;
            selectedRange.years && i <= Math.trunc(Number(selectedRange.years));
            i++
          ) {
            const year = `${range.start?.plus({ years: i }).get("year")}`;
            result.push(totalTime.find((item) => item.timePeriod === year));
          }
        default:
          break;
      }
      setSelectedTotalEntries(result.filter(Boolean) as PersonTotalTime[]);
    }
  };

  /**
   * Changes date picker views based on selected time span
   *
   */
  const viewRenderer = (): DateView[] => {
    switch (timespan) {
      case Timespan.WEEK:
        return ["year"];
      case Timespan.MONTH:
        return ["year", "month"];
      case Timespan.YEAR:
        return ["year"];
      default:
        return ["year", "month"];
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", mt: "1%" }}>
      <DatePicker
        disabled={loading}
        label={strings.timeExpressions.startDate}
        views={viewRenderer()}
        onChange={(dateTime) => {
          const isValid = dateTime instanceof Date && !isNaN(dateTime.getTime());
          if (isValid) {
            setRange({ ...range, start: dateTime });
          }
        }}
        value={range.start}
        minDate={earliestEntry}
        maxDate={today.minus({ days: 1 })}
      />
      {renderStartWeekSelect()}
      <DatePicker
        disabled={loading}
        sx={{ ml: "2%" }}
        label={strings.timeExpressions.endDate}
        views={viewRenderer()}
        onChange={(dateTime) => {
          const isValid = dateTime instanceof Date && !isNaN(dateTime.getTime());
          if (isValid) {
            setRange({ ...range, end: dateTime });
          }
        }}
        value={range.end}
        minDate={earliestEntry}
        maxDate={today}
      />
      {renderEndWeekSelect()}
    </Box>
  );
};

export default OverviewRangePicker;
