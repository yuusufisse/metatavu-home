import { Card, CardContent, Typography } from '@mui/material'
import { useAtom, useSetAtom } from 'jotai';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { errorAtom } from 'src/atoms/error';
import { oncallAtom } from 'src/atoms/oncall';
import { useLambdasApi } from 'src/hooks/use-api';
import strings from 'src/localization/strings';

const OnCallCard = () => {

    const { onCallApi } = useLambdasApi();
    const [onCallData, setOnCallData] = useAtom(oncallAtom);
    const [onCallPerson, setOnCallPerson] = useState("");

    const setError = useSetAtom(errorAtom);

    useEffect(() => {
        getOnCallData(DateTime.now().year);
    }, []);

    useEffect(() => {
        getCurrentOnCallPerson();
    }, [onCallData]);

    const getOnCallData = async (year: number) => {
        try {
        const fetchedData = await onCallApi.listOnCallData({ year: year.toString() });
        setOnCallData(fetchedData);
        } catch (error) {
        setError(`${strings.error.fetchFailedGeneral}, ${error}`);
        }
    };

    const getCurrentOnCallPerson = () => {
        const currentWeek = 10;
        const currentOnCallPerson = onCallData.find(
            (item) => Number(item.week) === currentWeek
        )?.person;

        if (currentOnCallPerson) setOnCallPerson(currentOnCallPerson);
    };
    
  return (
    <Link
    to={"oncall"}
    style={{ textDecoration: "none" }}
    >
        <Card>
        <CardContent>
            <Typography variant="h6" fontWeight={"bold"} style={{ marginTop: 6, marginBottom: 3 }}>
                On call calendar
            </Typography>
            <Typography variant="body1">On call person this week: <b>{onCallPerson}</b></Typography>
        </CardContent>
        </Card>
    </Link>
  )
}

export default OnCallCard