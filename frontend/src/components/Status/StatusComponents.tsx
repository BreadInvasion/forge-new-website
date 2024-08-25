import { styled } from 'styled-components';
import { grayDark, whiteA } from '@radix-ui/colors';

//Works for 90% of phones (With the settings for background and all that) Has some trouble with tablets
const mobileBreakpoint = "850px";

export const Cover = styled.div`
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 1% 2%;
`;

/******************************* Prusa Shelf ******************************** */


export const Prusas = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: 1fr;
    grid-gap: 1%;
    // display: flex;
    // gap: 1%;
    // flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`;

export const Card = styled.div<{ symbol?: string }>`
    // width: 15%;
    // min-width: 150px;
    width: 100%;
    flex-grow: 1000;
    padding: 10px;
    aspect-ratio: 5 / 4;
    display: flex;
    justify-content: space-between;
    border-radius: 20px;
    border: 1px solid #000000;
    position: relative;
    ${props => props?.symbol && `
        background-image: url(src/assets/img/symbols/${props.symbol}.svg);
        background-size: auto 90%;
        background-repeat: no-repeat;
        background-position: center;
    `}

    filter: drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.25));
    box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.5);
`;

export const Info = styled.div`
    width: max-content;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const MachineName = styled.h1`
    color: #000;

    font-family: Montserrat;
    font-size: 1.5vw;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-transform: uppercase;

    margin: 0;
    padding: 0;
`;

export const StatusText = styled.span<{area?: string}>`
    color: #000;

    font-family: Montserrat;
    font-size: 0.9vw;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    display: flex;
    width: max-content;
`;

export const ProgressBar = styled.div<{horizontal?: string}>`
    width: 10%;
    height: 100%;
    background-color: ${whiteA.whiteA11};
    border-radius: 1vw;
    border: 1px solid #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    ${props => props.horizontal && `
        width: auto;
        height: 100%;
        min-height: 10px;
        flex-direction: row;
        justify-content: flex-start;
    `}
`;

export const Progress = styled.div<{ progress: number, horizontal?: boolean }>`
    width: 100%;
    height: ${props => props.progress}%;
    background-color: green;
    border-radius: 9px;
    ${props => props.horizontal && `
        width: ${props.progress}%;
        height: 100%;
    `}
`;

/******************************* Other Machines ******************************** */

export const OtherMachines = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const ListItem = styled.div`
    width: 100%;
    height: 11%;
    display: flex;
    border-radius: 15px;
    border: 1px solid #000;
    justify-content: start;
    align-items: center;
    padding: 5px;
    gap: 1%;

    filter: drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.25));
    box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.5);
`;
export const ListIcon = styled.div<{ symbol?: string }>`
    height: 100%;
    aspect-ratio: 1 / 1;

    background-image: url(src/assets/img/symbols/${props => props.symbol}.svg);
    background-size: auto 90%;
    background-repeat: no-repeat;
    background-position: center;
`;
export const ListInfo = styled.div`
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;