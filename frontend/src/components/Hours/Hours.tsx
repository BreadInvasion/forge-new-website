import React, { useEffect } from 'react';
import WeeklyCalendar from './WeeklyCalendar'
import styled from 'styled-components';
import MonthlyCalendar from './MonthlyCalendar';
import VolunteerHighlight from './VolunteerHighlight';
import { useRecoilState, useRecoilValue } from 'recoil';
import { calendarEventsState, currentDateState } from 'src/GlobalAtoms';
import { VolunteerLevels } from 'src/Constants';

const HoursContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 3fr 2fr;
    padding: 1rem;
    padding-top: 4.75rem;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    grid-gap: 1rem;
`;



export default function Hours() {

    const events = useRecoilValue(calendarEventsState);
    const [date, setDate] = useRecoilState(currentDateState);

    const volunteersOnDuty = events.filter((event) => {
        return event.day === date.toLocaleString('en-US', {weekday: 'long'});
    }).filter((event) => {
        const eventStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(event.startTime.split(':')[0]), parseInt(event.startTime.split(':')[1]));
        const eventEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(event.endTime.split(':')[0]), parseInt(event.endTime.split(':')[1]));
        return eventStart <= date && date < eventEnd;
    }).sort((event1, event2) => {
        return VolunteerLevels[event1.level] > VolunteerLevels[event2.level] ? -1 : 1;
    });

    /**
     * Get the current date
     * - which will be passed to volunteer highlight (Or the filtered event list)
     * - to the monthly calendar
     * Monthly calendar will be able to select a week, 
    */

    return (
        <HoursContainer>
            <MonthlyCalendar />
            <VolunteerHighlight volunteers={volunteersOnDuty} />
            <WeeklyCalendar />
        </HoursContainer>
    );
}
// Add a way to have Volunteers be able to cancel and then notify E-Board