import React from 'react';
import { CalendarEvent, VolunteerLevels } from 'src/Constants';
import styled from 'styled-components';

interface VolunteerHighlightProps {
    volunteers: CalendarEvent[];
}

const VolunteerContainer = styled.div`
    grid-column: 1;
    grid-row: 2;
    display: flex;
    border: 1px solid #000;
    border-radius: 0.5rem;
    max-height: 100%;
    flex-direction: column;
    overflow-y: scroll;
    background-color: #fff;
`;

const VolunteerHeader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 1.25rem;
    text-align: center;
    padding: 0.5rem;
    border-bottom: 1px solid #000;
    background-color: #ddd;
`;

const Volunteer = styled.span`
    align-items: center;
    padding: 0.5rem;
    
    font-size: 0.9rem;
    font-weight: 600;
    & > h5 {
        font-size: 0.75rem;
        font-weight: normal;
        margin: 0;
    }
`;

export default function VolunteerHighlight({ volunteers }: VolunteerHighlightProps) {

    const formatTime = (time: string) => {
        const date = new Date(`2023-01-01T${time}`);

        const formattedTime = date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        return formattedTime;
    }

    return (
        <VolunteerContainer>
            <VolunteerHeader>On Hours</VolunteerHeader>
            {volunteers.map((volunteer) => (
                <Volunteer key={volunteer.id}>
                    {volunteer.name} - {volunteer.level}<br/>
                    <h5>{formatTime(volunteer.startTime)} - {formatTime(volunteer.endTime)}</h5>
                </Volunteer>
            ))}
        </VolunteerContainer>
    );
};