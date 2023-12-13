import { DatePicker, DateView } from "@mui/x-date-pickers";
import { DateTime, DurationObjectUnits } from "luxon";
import { useEffect, useMemo, useState } from "react";
import { PersonTotalTime, Timespan } from "../../generated/client";
import strings from "../../localization/strings";
import { Box, MenuItem, Select } from "@mui/material";
import { useAtomValue } from "jotai";
import { dailyEntriesAtom, timespanAtom } from "../../atoms/person";
import { getWeekFromISO } from "../../utils/time-utils";
import { between } from "../../utils/check-utils";
import { DateRange } from "../../types";

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
  const defaultDateRange = {
    start: today.minus({ days: 7 }),
    end: today
  };
  const defaultWeekRange = {
    start: "",
    end: ""
  };
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);
  const [weekRange, setWeekRange] = useState(defaultWeekRange);
  const startWeek = getWeekFromISO(
    weekRange.start?.split(",")[0],
    weekRange.start?.split(",")[2],
    dateRange.start.weekday
  );
  const endWeek = getWeekFromISO(
    weekRange.end?.split(",")[0],
    weekRange.end?.split(",")[2],
    dateRange.end.weekday
  );

  useMemo(() => {
    setDateRange(defaultDateRange);
    setWeekRange(defaultWeekRange);
  }, [timespan]);

  useEffect(() => {
    initializeWeekRange();

    return () => {
      setWeekRange(defaultWeekRange);
    };
  }, [totalTime]);

  useEffect(() => {
    setSelectedTotalEntries(getOverviewRange());
  }, [weekRange]);

  /**
   * Initializes default week values when selecting "By dateRange -> Week"
   *
   */
  const initializeWeekRange = () => {
    if (timespan === Timespan.WEEK) {
      setWeekRange({
        start: String(totalTime[3].timePeriod),
        end: String(totalTime[0].timePeriod)
      });
    }
  };

  /**
   * Get start dateRange time entries
   *
   * @returns start dateRange time entries
   */
  const getStartRangeTimeEntries = () =>
    totalTime.filter(
      (entry) =>
        entry.timePeriod?.split(",")[0] === String(dateRange.start.year) &&
        entry.timePeriod?.split(",")[2] !== "0" &&
        getWeekFromISO(
          entry.timePeriod?.split(",")[0],
          entry.timePeriod?.split(",")[2],
          dateRange.start.weekday
        ) < endWeek
    );

  /**
   * Get end dateRange time entries
   *
   * @returns end dateRange time entries
   */
  const getEndRangeTimeEntries = () =>
    totalTime.filter(
      (entry) =>
        entry.timePeriod?.split(",")[0] === String(dateRange.end.year) &&
        entry.timePeriod?.split(",")[2] !== "0" &&
        getWeekFromISO(
          entry.timePeriod?.split(",")[0],
          entry.timePeriod?.split(",")[2],
          dateRange.start.weekday
        ) > startWeek
    );

  /**
   * Get week dateRange boundaries
   *
   * @returns week dateRange boundaries
   */
  const getWeekRangeBoundaries = () => {
    const startRangeTimeEntries = getStartRangeTimeEntries();
    const endRangeTimeEntries = getEndRangeTimeEntries();
    let startRangeWeekNumbers = [];
    let endRangeWeekNumbers = [];
    const weekRangeBoundaries = {
      start: { min: 1, max: 1 },
      end: { min: 1, max: 1 }
    };

    startRangeWeekNumbers = startRangeTimeEntries.map((startRangeTimeEntry) =>
      Number(startRangeTimeEntry.timePeriod?.split(",")[2])
    );

    endRangeWeekNumbers = endRangeTimeEntries.map((endRangeTimeEntry) =>
      Number(endRangeTimeEntry.timePeriod?.split(",")[2])
    );

    if (startRangeWeekNumbers.length) {
      const startMax = startRangeWeekNumbers.reduce((a, b) => (a > b ? a : b));
      const startMin = startRangeWeekNumbers.reduce((a, b) => (a > b ? b : a));
      weekRangeBoundaries.start.max = startMax;
      weekRangeBoundaries.start.min = startMin;
    }

    if (endRangeWeekNumbers.length) {
      const endMax = endRangeWeekNumbers.reduce((a, b) => (a > b ? a : b));
      const endMin = endRangeWeekNumbers.reduce((a, b) => (a > b ? b : a));
      weekRangeBoundaries.end.max = endMax;
      weekRangeBoundaries.end.min = endMin;
    }

    return weekRangeBoundaries;
  };

  /**
   * Get week range within boundaries
   */
  const getWeekRangeWithinBoundaries = () => {
    const weekRangeBoundaries = getWeekRangeBoundaries();
    const rangeStartWeekNumber = between(
      dateRange.start.weekNumber,
      weekRangeBoundaries.start.min,
      weekRangeBoundaries.start.max
    )
      ? dateRange.start.weekNumber
      : weekRangeBoundaries.start.max;
    const rangeEndWeekNumber = between(
      dateRange.end.weekNumber,
      weekRangeBoundaries.end.min,
      weekRangeBoundaries.end.max
    )
      ? dateRange.end.weekNumber
      : weekRangeBoundaries.end.min;
    const newWeekRange = {
      start: `${dateRange.start.year},${dateRange.start.month},${rangeStartWeekNumber}`,
      end: `${dateRange.end.year},${dateRange.end.month},${rangeEndWeekNumber}`
    };

    return newWeekRange;
  };

  useMemo(() => {
    setWeekRange(getWeekRangeWithinBoundaries());
  }, [dateRange]);

  /**
   * Render start week Select dropdown when week dateRange is active
   */
  const renderStartWeekSelect = () => {
    if (timespan !== Timespan.WEEK) return;

    const startRangeTimeEntries = getStartRangeTimeEntries();

    return (
      <Select
        label="Start week"
        sx={{ width: "8%", ml: "5px" }}
        value={weekRange.start}
        onChange={(e) => {
          const weekStart = String(e.target.value);
          if (totalTime.some((entry) => entry.timePeriod === weekStart)) {
            setWeekRange({ ...weekRange, start: weekStart });
          }
        }}
      >
        {startRangeTimeEntries.map((entry) => (
          <MenuItem key={entry.timePeriod} value={entry.timePeriod}>
            {`${entry.timePeriod?.split(",")[2]}`}
          </MenuItem>
        ))}
      </Select>
    );
  };

  /**
   * Render end week Select dropdown when week dateRange is active
   */
  const renderEndWeekSelect = () => {
    if (timespan !== Timespan.WEEK) return;

    const endRangeTimeEntries = getEndRangeTimeEntries();

    return (
      <Select
        label="End week"
        sx={{ width: "8%", ml: "5px" }}
        value={weekRange.end}
        onChange={(e) => {
          setWeekRange({ ...weekRange, end: String(e.target.value) });
        }}
      >
        {endRangeTimeEntries.map((entry) => (
          <MenuItem key={entry.timePeriod} value={entry.timePeriod}>
            {`${entry.timePeriod?.split(",")[2]}`}
          </MenuItem>
        ))}
      </Select>
    );
  };

  /**
   * Gets total time from the selected time span.
   */
  const getOverviewRange = () => {
    const result = [];
    let selectedRange: DurationObjectUnits;

    switch (timespan) {
      case Timespan.WEEK: {
        selectedRange = endWeek.diff(startWeek, "weeks").toObject();

        for (let i = 0; selectedRange.weeks && i <= Math.trunc(Number(selectedRange.weeks)); i++) {
          const week = `${startWeek.plus({ weeks: i }).get("year")},${startWeek
            .plus({ weeks: i })
            .get("month")},${startWeek.plus({ weeks: i }).get("weekNumber")}`;

          result.push(totalTime.find((item) => item.timePeriod === week));
        }
      }
      break;
      case Timespan.MONTH:
        selectedRange = dateRange.end.diff(dateRange.start, "months").toObject();
        for (
          let i = 0;
          selectedRange.months && i <= Math.trunc(Number(selectedRange.months));
          i++
        ) {
          const month = `${dateRange.start?.plus({ months: i }).get("year")},${dateRange.start
            ?.plus({ months: i })
            .get("month")}`;

          result.push(totalTime.find((item) => item.timePeriod === month));
        }
        break;
      case Timespan.YEAR:
        selectedRange = dateRange.end.diff(dateRange.start, "year").toObject();
        for (let i = 0; selectedRange.years && i <= Math.trunc(Number(selectedRange.years)); i++) {
          const year = `${dateRange.start?.plus({ years: i }).get("year")}`;
          result.push(totalTime.find((item) => item.timePeriod === year));
        }
        break;
      default:
        break;
    }

    return result.filter(Boolean) as PersonTotalTime[];
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
        onChange={(startDate: DateTime | null) => {
          startDate && setDateRange({ ...dateRange, start: startDate });
        }}
        value={dateRange.start}
        minDate={earliestEntry}
        maxDate={dateRange.end}
      />
      {renderStartWeekSelect()}
      <DatePicker
        disabled={loading}
        sx={{ ml: "2%" }}
        label={strings.timeExpressions.endDate}
        views={viewRenderer()}
        onChange={(endDate: DateTime | null) => {
          endDate && setDateRange({ ...dateRange, end: endDate });
        }}
        value={dateRange.start > dateRange.end ? dateRange.start : dateRange.end}
        minDate={dateRange.start}
        maxDate={today}
      />
      {renderEndWeekSelect()}
    </Box>
  );
};

export default OverviewRangePicker;
