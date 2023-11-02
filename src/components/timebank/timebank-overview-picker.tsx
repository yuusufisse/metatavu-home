import { DatePicker, DateView } from "@mui/x-date-pickers";
import { DateTime, DurationObjectUnits } from "luxon";
import { useEffect, useState } from "react";
import { PersonTotalTime, Timespan } from "../../generated/client";
import { Range } from "../../types";
import strings from "../../localization/strings";
import { Box, Button, MenuItem, Select } from "@mui/material";
import { useAtomValue } from "jotai";
import { timespanAtom } from "../../atoms/person";
import { formatISOWeeks } from "../../utils/time-utils";
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
  const { setSelectedTotalEntries, selectedTotalEntries, totalTime, today, loading } = props;

  const timespan = useAtomValue(timespanAtom);

  const [range, setRange] = useState<Range>({
    start: today.minus({ days: 7 }),
    end: today
  });

  const [weekRange, setWeekRange] = useState({
    start: totalTime[totalTime.length - 1].timePeriod,
    end: totalTime[0].timePeriod
  });

  useEffect(() => {
    getOverviewRange();
  }, [timespan, range, totalTime, weekRange]);

  /**
   * Gets total time from the selected time span.
   */
  const getOverviewRange = () => {
    if (range.start && range.end) {
      const result = [];
      let selectedRange: DurationObjectUnits;

      switch (timespan) {
        case Timespan.WEEK: {
          const startWeekISO = `${weekRange.start?.split(",")[0]}-W${formatISOWeeks(
            weekRange.start?.split(",")[2]
          )}-${range.start.weekday}`; //Formats YYYY,MM,WW from persontotalTime to ISO string (YYYY-WWW-D)
          const endWeekISO = `${weekRange.end?.split(",")[0]}-W${formatISOWeeks(
            weekRange.end?.split(",")[2]
          )}-${range.end.weekday}`;

          const startWeek = DateTime.fromISO(startWeekISO);
          const endWeek = DateTime.fromISO(endWeekISO);

          selectedRange = endWeek.diff(startWeek, "weeks").toObject();

          for (
            let i = 0;
            selectedRange.weeks && i <= Math.trunc(Number(selectedRange.weeks));
            i++
          ) {
            result.push(
              totalTime.find(
                (item) =>
                  item.timePeriod ===
                  `${startWeek.plus({ weeks: i }).get("year")},${startWeek
                    .plus({ weeks: i })
                    .get("month")},${startWeek.plus({ weeks: i }).get("weekNumber")}`
              )
            );
          }
        }
        case Timespan.MONTH:
          selectedRange = range.end.diff(range.start, "months").toObject();
          for (
            let i = 0;
            selectedRange.months && i <= Math.trunc(Number(selectedRange.months));
            i++
          ) {
            result.push(
              totalTime.find(
                (item) =>
                  item.timePeriod ===
                  `${range.start?.plus({ months: i }).get("year")},${range.start
                    ?.plus({ months: i })
                    .get("month")}`
              )
            );
          }
        case Timespan.YEAR:
          selectedRange = range.end.diff(range.start, "year").toObject();
          for (
            let i = 0;
            selectedRange.years && i <= Math.trunc(Number(selectedRange.years));
            i++
          ) {
            result.push(
              totalTime.find(
                (item) => item.timePeriod === `${range.start?.plus({ years: i }).get("year")}`
              )
            );
          }
        default:
          break;
      }
      if (result.length) {
        setSelectedTotalEntries(result.filter((item) => item));
      }
    }
  };

  /**
   * Changes date picker views based on selected time span
   * Week view does not exist in MUI date picker.
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
          setRange({ ...range, start: dateTime });
          console.log(range.start?.toISODate());
        }}
        value={range.start}
        maxDate={range.end?.minus({ days: 1 })}
      />
      {timespan === Timespan.WEEK ? (
        <Select
          sx={{ width: "6%", ml: "5px" }}
          value={weekRange.start}
          onChange={(e) => {
            setWeekRange({ ...weekRange, start: String(e.target.value) });
            console.log(e.target.value);
          }}
        >
          {totalTime
            .filter((entry) => entry.timePeriod?.split(",")[0] === String(range.start?.year))
            .map((entry) => (
              <MenuItem value={entry.timePeriod}>{`${entry.timePeriod?.split(",")[2]}`}</MenuItem>
            ))}
        </Select>
      ) : null}
      <DatePicker
        disabled={loading}
        sx={{ ml: "2%" }}
        label={strings.timeExpressions.endDate}
        views={viewRenderer()}
        onChange={(dateTime) => setRange({ ...range, end: dateTime })}
        value={range.end}
        minDate={range.start?.plus({ days: 1 })}
      />
      {timespan === Timespan.WEEK ? (
        <Select
          label="End week"
          sx={{ width: "6%", ml: "5px" }}
          value={weekRange.end}
          onChange={(e) => {
            setWeekRange({ ...weekRange, end: String(e.target.value) });
            console.log(e.target.value);
          }}
        >
          {totalTime
            .filter((entry) => entry.timePeriod?.split(",")[0] === String(range.end?.year))
            .map((entry) => (
              <MenuItem value={entry.timePeriod}>{`${entry.timePeriod?.split(",")[2]}`}</MenuItem>
            ))}
        </Select>
      ) : null}
      <Button onClick={() => console.log(selectedTotalEntries, weekRange)}>TEST</Button>
    </Box>
  );
};

export default OverviewRangePicker;
