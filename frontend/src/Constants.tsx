import { RuleSet, css } from "styled-components";

export enum PageValues {
    HOME = 'home',
    HOURS = 'hours',
    STATUS = 'status',
    LOGIN = 'login',
    HOMENEW = 'home-new'
}

export enum ScreenTypes {
    DESKTOP = 'desktop',
    MOBILE = 'mobile',
    MOBILE_EXPANDED = 'mobile-expanded'
};

export const MOBILE_SIZE = 600;

export const TITLE_TEXT = "THE FORGE";

export const DESCRIPTION_TEXT = "The Forge provides a collaborative environment " +
                                "for students at Rensselaer to explore rapid prototyping " +
                                "and design. We promote communication and sharing of " +
                                "expertise between our members and volunteers. We also " +
                                "provide our members with access to a wide range of " +
                                "equipment - including but not limited to 3D printers, " +
                                "a laser cutter, and an electronics workstation. " +
                                "Additionally, we host workshops, design competitions, " +
                                "and outreach events every semester.";

export const MOBILE_DESCRIPTION_TEXT = "We are Rensselaer Polytechnic Institutes only " +
                                       "interdisciplinary makerspace, and are 100% student run!";

export const LOCATION_TEXT = "Drop in and check us out: We're located in ";

export const ROOM_TEXT = "CII 2037A!";

export interface Machine {
    machineType: string;
    machineName: string;
    user?: string;
    start?: number;
    end?: number;
    status: PrinterStatus;
};

export enum PrinterStatus {
    IDLE = 'idle',
    BUSY = 'busy',
    SUCCESS = 'success',
    FAILED = 'failed',
    BROKEN = 'broken'
};

/* -------------------------- Calendar -------------------------- */
export const BORDER = '1px solid #000';

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const NUM_COLUMNS_IN_DAY = 7;

export const COLORS = [
    '#77DD77', '#99c5c4', '#89cff0', '#aa9499', '#aaf0d1',
    '#b39eb5', ' #9adedb ', '#bee7a5', '#ff9899', '#ff694f',
];

export enum VolunteerLevels {
    FORGE1 = 1,
    FORGE2 = 2,
    MANAGER = 3,
    ADMIN = 4
};

export type CalendarEvent = {
    name: string;
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    calOffset: number;
    level: VolunteerLevels;
};