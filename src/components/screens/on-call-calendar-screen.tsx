import React, { useEffect, useState } from "react";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Badge, Box, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useApi } from "../../hooks/use-api";
import { oncallAtom } from "../../atoms/oncall";
import { useAtom, useSetAtom } from "jotai";
import { errorAtom } from "../../atoms/error";
import strings from "../../localization/strings";

const OnCallCalendarScreen = () => {
  const { onCallApi } = useApi();
  // const [onCallData, setOnCallData] = useAtom(oncallAtom)
  const [onCallData, setOnCallData] = useState<any[]>([])
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
    generateCalendarProps()
  }, [])

  const generateCalendarProps = () => {

    const daysOfTheWeek: unknown[] = [];
    console.log(onCallData)
    onCallData.forEach(element => {
      const weeks = DateTime.fromObject({ weekNumber: Number(element.Week), weekYear: 2024 });
  
      for (let i = 0; i < 7; i++) {
        daysOfTheWeek.push({ date: weeks.plus({ days: i }).toISODate(), person: element.Person, paid: element.Paid, badgeColor: stringToColour(element.Person) });
      }
      console.log(daysOfTheWeek)
    });
    return daysOfTheWeek;
  }

  const stringToColour = (str: string): string => {
    let hash = 0;
    str.split('').forEach(char => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      colour += value.toString(16).padStart(2, '0')
    }
    return colour;
  }

  function ServerDay(props: PickersDayProps<DateTime> & { highlightedDays?: number[] }) {
    const { day, outsideCurrentMonth, ...other } = props;
    const calendarProps = generateCalendarProps();
    const badgeColor = calendarProps.filter((item) => item.date === day.toISODate())[0]?.badgeColor;
    const populatedDay = calendarProps.map((item) => item.date).includes(day.toISODate());
    const personName = calendarProps.filter((item) => item.date === day.toISODate())[0]?.person;
    const personInitials = personName?.split(" ")[0][0] + personName?.split(" ")[1][0]
    const paidStatus = calendarProps.filter((item) => item.date === day.toISODate())[0]?.paid;
    const paid = <Typography sx={{ color: "green", fontSize: 10 }}>€</Typography>;
  
    const isSelected = !props.outsideCurrentMonth;
  
    return (
      <Box sx={{ display: "flex" }}>
      <Badge
        key={props.day.toString()}
        overlap={"circular"}
        sx={{ color: "black", ".MuiBadge-overlapCircular": { backgroundColor: badgeColor } }}
        badgeContent={populatedDay ? personInitials : undefined}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    </Box>
    );
  }
  
  return (
    <>
      <DateCalendar displayWeekNumber={true} slots={{ day: ServerDay }} />
      <button onClick={() => console.log(onCallData)}>TEST</button>
    </>
  );
};

export default OnCallCalendarScreen;
