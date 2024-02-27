import { atom } from "recoil";
import { ScreenTypes, PageValues, MOBILE_SIZE, Machine, PrinterStatus, CalendarEvent, WEEKDAYS, VolunteerLevels } from "src/Constants";
import mockMachineTypes from "./assets/mock-data/MockMachineTypes.json";
import mockMachineData from "./assets/mock-data/MockMachineData.json";
import mockCalendarEvents from "./assets/mock-data/MockCalendarEvents.json";
import {v4 as uuid } from 'uuid';

const getPageFromUrl = () => {
    const url = window.location.href;
    const urlSplit = url.split('/');
    let page = urlSplit[urlSplit.length - 1];

    if (page === null || !Object.values(PageValues).includes(page as PageValues)) {
        page = PageValues.HOME;
    }
    console.log(page);
    return page;
};

const getScreenTypeFromScreenSize = () => {
    if (window.innerWidth <= MOBILE_SIZE) {
        return ScreenTypes.MOBILE;
    } else {
        return ScreenTypes.DESKTOP;
    }
}

export const pageState = atom({
    key: 'forgePage',
    default: getPageFromUrl(),
});

export const screenState = atom({
    key: 'screenType',
    default: getScreenTypeFromScreenSize(),
});

const getMachineTypes = () => {
    const machineTypes: string[] = mockMachineTypes;
    return machineTypes;
}

const getMachinesData = () => {
    const machinesData: Machine[] = mockMachineData.map((machine: any) => {
        return {
            machineType: machine.machineType,
            machineName: machine.machineName,
            user: machine?.user,
            start: machine?.start,
            end: machine?.end,
            status: machine.status as PrinterStatus
        };
    });
    return machinesData;
};

export const machineTypesState = atom({
    key: 'machineTypes',
    default: getMachineTypes(),
});

export const machinesState = atom({
    key: 'machines',
    default: getMachinesData(),
});

export const machineUsagesState = atom({
    key: 'machineUsages',
    default: [],
});

const eventsOverlap = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
    const event1Start = new Date(`2023-01-01T${event1.startTime}`);
    const event1End = new Date(`2023-01-01T${event1.endTime}`);
    const event2Start = new Date(`2023-01-01T${event2.startTime}`);
    const event2End = new Date(`2023-01-01T${event2.endTime}`);
    let overlap = event1Start < event2End && event1End > event2Start;
    return overlap;
}

const layerEvents = (_events: CalendarEvent[], day: string) => {
    let events = _events.map((event) => { //copy events
        return {
            name: event.name,
            id: event.id,
            day: event.day,
            startTime: event.startTime,
            endTime: event.endTime,
            calOffset: -1,
            level: event.level as VolunteerLevels,
        };
    });
    let finalEvents: CalendarEvent[] = [];
    let unvisited = events.slice(1);
    
    for (const event of events) {
        let chain = 0;
        if (event.calOffset === -1) {
            event.calOffset = chain;
            finalEvents.push(event);
        }
        for (let otherEvent of unvisited) {
            if (!(eventsOverlap(event, otherEvent))) break;
            chain += (chain === event.calOffset) ? 1 : 0;
            otherEvent.calOffset = chain++;
            finalEvents.push(otherEvent);
        }
        if (chain !== 0) {
            chain-=1
        };
        unvisited = unvisited.slice(chain);
    }
    console.log("Final Events of "+day+":");
    console.log(finalEvents);
    return finalEvents;
};

const getCalendarEvents = () => {
    const events: CalendarEvent[] = mockCalendarEvents.map((event: any) => {
        return {
            name: event.name,
            id: uuid(),
            day: event.day,
            startTime: event.startTime,
            endTime: event.endTime,
            calOffset: -1,
            level: event.level as VolunteerLevels,
        };
    });

    let sortedEvents: CalendarEvent[] = [];

    WEEKDAYS.map((day: string) => {
        const dayEvents = events.filter((event) => event.day === day)
                                .sort((event1, event2) => {
                                    const event1Start = new Date(`2023-01-01T${event1.startTime}`);
                                    const event2Start = new Date(`2023-01-01T${event2.startTime}`);

                                    if (event1.startTime === event2.startTime) {
                                        return VolunteerLevels[event1.level] < VolunteerLevels[event2.level] ? -1 : 1;
                                    }
                                    return event1Start < event2Start ? -1 : 1;
                                });
        if (dayEvents.length > 1) {
            const newDayEvents = layerEvents(dayEvents, day).sort((event1, event2) => {
                return event1.calOffset < event2.calOffset ? -1 : 1;
            });
            sortedEvents = [...sortedEvents, ...newDayEvents];
        } else {
            const newDayEvents = dayEvents.map((event) => {
                event.calOffset = 0;
                return event;
            });
            sortedEvents = [...sortedEvents, ...newDayEvents];
        }
        
    });
    console.log("Final Event List:");
    console.log(sortedEvents);
    return sortedEvents;
}

export const calendarEventsState = atom({
    key: 'calendarEvents',
    default: getCalendarEvents(),
});

export const currentDateState = atom({
    key: 'currentDate',
    default: new Date(`2023-12-13T12:00`),
});

export const emailState = atom({
    key: 'email',
    default: '',
});

export const passwordState = atom({
    key: 'password',
    default: '',
});

export const isMenuOpenState = atom({
    key: 'isMenuOpen',
    default: false,
});