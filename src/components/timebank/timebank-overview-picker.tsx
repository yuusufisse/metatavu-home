import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { PersonTotalTime } from "../../generated/client";
import { Range } from "../../types";
import strings from "../../localization/strings";
import { Button } from "@mui/material";
/**
 * Component properties
 */
interface Props {
  totalTime: PersonTotalTime[];
  selectedTotalEntries : PersonTotalTime[];
  setSelectedTotalEntries: (selectedTotalEntries: PersonTotalTime[]) => void;
  today: DateTime;
}

/**
 * Date Range Picker component
 */
const OverviewRangePicker = (props: Props) => {
  const { setSelectedTotalEntries, selectedTotalEntries, totalTime, today } = props;

  const [range, setRange] = useState<Range>({
    start: today.minus({ days: 7 }),
    end: today
  });

  useEffect(() => {
    getOverviewRange();
  }, [range]);

  /**
   * Gets daily entries within time range
   * Filters null entries, commonly weekends.
   */
  const getOverviewRange = () => {
    if (range.start && range.end) {
      const selectedRange = range.end.diff(range.start, "months").toObject();
      const result = [];
      console.log(Math.trunc(Number(selectedRange.months)))
      for (let i = 0; selectedRange.months && i <= Math.trunc(Number(selectedRange.months)); i++) {
        
        result.push(
          totalTime.filter(
            (item) =>
              item.timePeriod ===
              `${range.start?.plus({months : i}).get("year")},${range.start?.plus({months : i}).get("month")}`
          )[0]
        );
        console.log(`${range.start?.plus({months : i}).get("year")},${range.start?.plus({months : i}).get("month")}`)
      }
      setSelectedTotalEntries(result.filter((item) => item));
      console.log(totalTime, result)
    }
  };
//`${range.start?.get("year")},${range.start?.get("month")}` YYYY,MM
//`${range.start?.get("year")},${range.start?.get("month")},${range.end?.weekNumber}` YYY,MM,WW
  return (
    <>
      <DatePicker
        sx={{
          width: "24%",
          mx: "1%"
        }}
        label={strings.timeExpressions.startDate}
        views={["year", "month"]}
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
        views={["year", "month"]}
        onChange={(dateTime) => setRange({ ...range, end: dateTime })}
        value={range.end}
        minDate={range.start?.plus({ days: 1 })}
      />
      <Button onClick={() => console.log(totalTime[0].timePeriod, `${range.start?.get("year")},${range.start?.get("month")},${range.end?.weekNumber}`)}>TEST</Button>
    </>
  );
};

export default OverviewRangePicker;
