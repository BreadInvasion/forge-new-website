import React from 'react';
import { useRecoilState } from 'recoil';
import { currentDateState } from 'src/GlobalAtoms';
import styled from 'styled-components';

const CalendarContainer = styled.div`
    grid-column: 1;
    grid-row: 1;
    display: grid;
    grid-template-rows: 2fr repeat(7, 1fr); // Need to make this dynamic based on num weeks of month
    grid-template-columns: repeat(7, 1fr);
    border: 1px solid #000;

    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #fff;
`;

const MonthHeader = styled.div`
    grid-row: 1;
    grid-column: 1 / grid-column-end;
    display: flex;

    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 1.5rem;
    text-align: center;
`;

const DayCell = styled.div<{ day: number }>`
    grid-column: ${props => (props.day) % 7};
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default function MonthlyCalendar() {

    const [date, setDate] = useRecoilState(currentDateState);

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Gets the number of days in the current month somehow
    console.log("daysInMonth", daysInMonth);
    const daysArray = Array.from({length: daysInMonth}, (_, i) => i + 1);
    const firstDayOffset = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const dayAbbrs = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return (
        <CalendarContainer>
            <MonthHeader>{date.toLocaleDateString('en-US', {year: 'numeric', month: 'long'})}</MonthHeader>
            {dayAbbrs.map((day, index) => (
                <DayCell key={day} day={index+1}>{day}</DayCell>
            ))}
            {daysArray.map((day) => (
                <DayCell key={day} day={firstDayOffset + day}>{day}</DayCell>
            ))}
        </CalendarContainer>
    );
};
