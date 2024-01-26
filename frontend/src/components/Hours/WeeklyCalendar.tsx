import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { calendarEventsState } from 'src/GlobalAtoms';
import { COLORS, CalendarEvent, VolunteerLevels, WEEKDAYS, NUM_COLUMNS_IN_DAY } from 'src/Constants';
import styled from 'styled-components';


const CalendarGrid = styled.div<{ numhours: number }>`
    grid-column: 2 / grid-column-end;
    grid-row: 1 / grid-row-end;
    display: grid;
    grid-template-columns: ${Math.ceil(NUM_COLUMNS_IN_DAY / 2)+1}fr repeat(${7 * NUM_COLUMNS_IN_DAY}, 2fr);
    grid-template-rows: 1fr repeat(${props => props.numhours * 2}, 0.5fr);
    // margin: 2rem 1rem 2rem auto;
    background-color: #fff;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
    max-height: 100%; /* Set the maximum height for the element */
    overflow-y: auto; /* Add a vertical scrollbar when content exceeds the height */
    overflow-x: hidden; /* Hide the horizontal scrollbar */
    border: 1px solid #000;
    border-radius: 0.375rem;
`;


const TimeColumn = styled.div`
    grid-column: 1;
    grid-row: 1 / grid-row-end;
    display: grid;
    grid-template-rows: subgrid;
    background-color: #ddd;
`;

const TimeHeader = styled.div<{ row: number }>`
    grid-row: ${props => (props.row * 2) + 2} / ${props => (props.row * 2) + 4};
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #000;
    font-size: 0.75rem;
    font-weight: bold;
    box-sizing: border-box;
    // min-height: 3rem;
`;

const DayColumn = styled.div<{ col: number }>`
    grid-column: ${props => (props.col * NUM_COLUMNS_IN_DAY) + 2} / ${props => ((props.col + 1) * NUM_COLUMNS_IN_DAY) + 2};
    grid-row: 1 / grid-row-end;
    display: grid;
    grid-template-rows: subgrid;
    grid-template-columns: subgrid;
    border-left: 1px solid #000;
`;

const DayHeader = styled.div`
    grid-row: 1;
    grid-column: 1/grid-column-end;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ddd;
    font-weight: bold;
`;

const TimeSlot = styled.div<{ row: number }>`
    grid-row: ${props => props.row + 1};
    grid-column: 1/grid-column-end;
    border-top: 1px solid #000;
    // min-height: 1.5rem;
`;

const EventOverlay = styled.div<{ 
    start: number, 
    end: number, 
    col: number, 
    color: string, 
    level: VolunteerLevels
}>`
    grid-row: ${props => props.start + 1} / ${props => props.end+ 1};
    grid-column: ${props => props.col === -1 ? 1 : (props.col + 1)} / grid-column-end;
    background-color: ${props => props.color};
    border: ${props => props.level === VolunteerLevels.MANAGER || 
                       props.level === VolunteerLevels.ADMIN ? 
                       '2px solid #EEC600' : '1px solid #000'
    };
    margin: 0.125rem;
    border-radius: 0.375rem;
    padding: 0.125rem;
    padding-left: 0.25rem;

    font-size: 0.625rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const WeeklyCalendar = () => {
    const [events, setEvents] = useRecoilState(calendarEventsState);

    const generateTimeList = (startTime: string, endTime: string): string[] => {
        const start = new Date(`2023-01-01T${startTime}`);
        const end = new Date(`2023-01-01T${endTime}`);
        const timeList: string[] = [];

        const timeIncrement = 60 * 60 * 1000; // 1 hour in milliseconds

        for (let time = start; time <= end; time.setTime(time.getTime() + timeIncrement)) {
            const formattedTime = time.toLocaleTimeString([], { hour: 'numeric' });
            timeList.push(formattedTime);
        }
        timeList.pop(); // Remove last time (end time)
        return timeList;
    };

    const getRowFromTime = (time: string): number => {
        const hours = parseInt(time.split(':')[0]) - 9;
        const minutes = parseInt(time.split(':')[1]);

        return hours * 2 + (minutes === 30 ? 2 : 1);
    }

    const getNumOverLappingInRow = (row: number, day: string): number => {
        const eventsInCol = events.filter(event => event.day === day);
        const eventsInRow = eventsInCol.filter(event => getRowFromTime(event.startTime) <= row && getRowFromTime(event.endTime) > row);
        return eventsInRow.length;
    }

    const hours = generateTimeList('09:00', '18:00');

    return (
        <CalendarGrid numhours={hours.length}>
            <TimeColumn id="time-column">
                {hours.map((time, index) => (
                    <TimeHeader key={index} row={index}>{time}</TimeHeader>
                ))}
            </TimeColumn>
            {WEEKDAYS.map((day, index) => (
                <DayColumn id={`day-column-${day}`} key={index} col={index}>
                    <DayHeader>{day}</DayHeader>

                    {Array.from({ length: hours.length * 2}, (_, i) => i+1).map((time) => (
                        <TimeSlot key={time} row={time}/>
                    ))}

                    {events.filter(event => event.day === day).map((event, index) => (
                        <EventOverlay
                            key={day + "-" + event.id}
                            start={getRowFromTime(event.startTime)}
                            end={getRowFromTime(event.endTime)}
                            col={event.calOffset}
                            color={COLORS[Math.floor(Math.random() * 10)]}
                            level={event.level}
                        >
                            {getNumOverLappingInRow(getRowFromTime(event.startTime), day) === event.calOffset + 1 ? event.name : ""}
                        </EventOverlay>
                    ))}
                </DayColumn>
            ))}

        </CalendarGrid>
    );
};
export default WeeklyCalendar;
