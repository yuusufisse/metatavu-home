import { type SetStateAction } from 'react';
import { DailyEntry, PersonTotalTime, Timespan } from '../../../generated/client'
import { getHoursAndMinutes } from '../../../utils/time-utils';
import { List, ListItem, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { userProfileAtom } from '../../../atoms/auth';
import { useAtomValue } from 'jotai';

interface Props {
    personTotalTime: PersonTotalTime | undefined
    personDailyEntry: DailyEntry | undefined
    getPersonData: (timespan : Timespan) => Promise<void>
    timespanSelector: any
    setTimespanSelector: SetStateAction<any>
}

const BalanceData = (props: Props) => {
    const { personTotalTime, personDailyEntry, getPersonData, timespanSelector, setTimespanSelector } = props;
    const userProfile = useAtomValue(userProfileAtom);

    const handleBalanceViewChange = (e : SelectChangeEvent) => {
        setTimespanSelector(e.target.value)
        switch (e.target.value) {
            case "Week":
                getPersonData(Timespan.WEEK);
                break;
            case "Month":
                getPersonData(Timespan.MONTH);
                break;
            case "Year":
                getPersonData(Timespan.YEAR);
                break;
            case "All":
                getPersonData(Timespan.ALL_TIME);
                break;
            default:
                getPersonData(Timespan.ALL_TIME);
                break;
        }
    }

  return (
    <div style={{margin:"20px"}}>
        <Typography>Hello, {userProfile?.firstName} {userProfile?.lastName}</Typography><br/>
        <Typography sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>Your work hour statistics of today:
            <List>
                <ListItem>Balance: {getHoursAndMinutes(Number(personDailyEntry?.balance))}</ListItem>
                <ListItem>Logged time: {getHoursAndMinutes(Number(personDailyEntry?.logged))}</ListItem>
                <ListItem>Expected: {getHoursAndMinutes(Number(personDailyEntry?.expected))}</ListItem>
            </List>
            </Typography><br/>
        <Select sx={{width:"50%", marginBottom:"20px"}} value={timespanSelector} onChange={handleBalanceViewChange}>
            <MenuItem value={"Week"}>Week</MenuItem>
            <MenuItem value={"Month"}>Month</MenuItem>
            <MenuItem value={"All"}>All time</MenuItem>
        </Select>
        <Typography sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <List>
                <ListItem>{(personTotalTime) ?`Balance: ${getHoursAndMinutes(Number(personTotalTime?.balance))}` :null}</ListItem>
                <ListItem>{(personTotalTime) ?`Logged time: ${getHoursAndMinutes(Number(personTotalTime?.logged))}` :null}</ListItem>
                <ListItem>{(personTotalTime) ?`Expected: ${getHoursAndMinutes(Number(personTotalTime?.expected))}` :null}</ListItem>
            </List>
        </Typography>
    </div>
  )
}

export default BalanceData;