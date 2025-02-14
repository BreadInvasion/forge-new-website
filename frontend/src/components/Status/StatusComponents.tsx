import { styled } from 'styled-components';
import { grayDark, whiteA } from '@radix-ui/colors';

//Works for 90% of phones (With the settings for background and all that) Has some trouble with tablets
const mobileBreakpoint = "850px";

/******************************* Prusa Shelf ******************************** */


export const Prusas = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10%,15%));
    grid-auto-rows: 1fr;
    grid-auto-flow: row;
    grid-gap: 1%;
    // display: flex;
    // gap: 1%;
    // flex-wrap: wrap;
    padding: 1% 2%;
    overflow-y: auto;
    align-items: center;
    justify-content: center;
`;

export const Card = styled.div<{ symbol?:string; minimized?:boolean; highlight?:boolean}>`
    display: flex;
    height: min-content;
    padding: 15px;
    aspect-ratio: 5 / 4;
    justify-content: space-between;
    border-radius: 20px;
    border: ${({highlight }) => (highlight ? "1px solid #000000" : "2px solid #EE4B2B")};
    font-size: ${({ minimized }) => (minimized ? "2.5vh" : "3.5vh")};
    ${props => props?.symbol && `
        background-image: url(src/assets/img/symbols/${props.symbol}.svg);
        background-size: auto 90%;
        background-repeat: no-repeat;
        background-position: center;
    `}

    filter: drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.25));
    box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.5);
`;

export const Info = styled.div<{minimized?: boolean}>`
    font-size: ${({ minimized }) => (minimized ? "2.5vh" : "3.5vh")};
    color: #000000;
    height: auto;
    display: flex;
    gap: 5%;
    flex-direction: column;
`;

export const MachineName = styled.h3<{minimized?: boolean}>`
    font-size: ${({ minimized }) => (minimized ? "3.5vh" : "4.5vh")};
    color: #000000;
    font-family: Montserrat;
    text-transform: uppercase;
    margin: 0;
    padding: 0;
`;

export const StatusText = styled.span<{area?: string, minimized?:boolean}>`
    font-size: ${({ minimized }) => (minimized ? "0.9vw" : "1.2vw")};
    color: #000000;
    font-family: Montserrat;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
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
    border-radius: 1vw;
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