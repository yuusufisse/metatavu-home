import React, { useEffect } from "react";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Badge } from "@mui/material";
import { DateTime } from "luxon";
import { useApi } from "../../hooks/use-api";
import { oncallAtom } from "../../atoms/oncall";
import { useAtom, useSetAtom } from "jotai";
import { errorAtom } from "../../atoms/error";
import strings from "../../localization/strings";

function ServerDay(props: PickersDayProps<DateTime> & { highlightedDays?: number[] }) {
  const { day, outsideCurrentMonth, ...other } = props;

  const isSelected = !props.outsideCurrentMonth;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🌚" : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

const OnCallCalendarScreen = () => {
  const { onCallApi } = useApi();
  const [onCallData, setOnCallData] = useAtom(oncallAtom)
  const setError = useSetAtom(errorAtom);

  const getOnCallData = async () => {
      try {
        const fetchedData = await onCallApi.listOnCallData({year : "2024"})
        setOnCallData(fetchedData);
      } catch (error) {
        setError(`${strings.error.fetchFailedGeneral}, ${error}`);
      }
    console.log(onCallData)
  }

  useEffect(() => {
    getOnCallData()
  }, [])
  
  return (
    <>
      <DateCalendar displayWeekNumber={true} slots={{ day: ServerDay }} />
    </>
  );
};

export default OnCallCalendarScreen;
