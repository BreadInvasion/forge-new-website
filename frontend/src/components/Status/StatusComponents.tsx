import styled from 'styled-components';
import { grayDark, whiteA } from '@radix-ui/colors';

// Works for 90% of phones (With the settings for background and all that) Has some trouble with tablets
const mobileBreakpoint = "850px";

/******************************* Prusa Shelf ******************************** */


export const GridContainer = styled.div`
    grid-area: status;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    align-items: stretch;
    column-gap: 10px;
`;

export const Card = styled.div<{ $symbol?: string; $minimized?: boolean; $highlightFailed?: boolean; progress: number }>`
    background-color: #f5f5f5;
    border-radius: 5px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 0.1rem;
    width: ${({ $minimized }) => ($minimized ? 'clamp(8vw, 10vw, 12vw)' : 'clamp(20vw, 25vw, 30vw)')};
    max-width: 100%;
    height: ${({ $minimized }) => ($minimized ? 'clamp(15vh, 17vh, 19vh)' : 'auto')};
    max-height: 100%;
    aspect-ratio: ${({ $minimized }) => ($minimized ? '1 / 1' : 'auto')};
    flex-shrink: 0;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    border-radius: ${({ $minimized }) => ($minimized ? '5px' : '10px')}; 
    box-shadow: ${({ $highlightFailed }) =>
        $highlightFailed ? '0 0 10px 2px red' : '0 0 5px rgba(0, 0, 0, 0.5)'};
    border: ${({ $minimized }) => ($minimized ? '1px solid #ccc' : '1px solid #999')};
    font-size: ${({ $minimized }) => ($minimized ? "2.5vh" : "3.0vh")};
    ${props => props?.$symbol && `
        background-image: url(src/assets/img/symbols/${props.$symbol}.svg);
        background-size: auto 90%;
        background-repeat: no-repeat;
        background-position: center;
    `}
    position: relative;

    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: ${props => props.progress}%;
        background-color: rgba(0, 255, 0, 0.2);
        border-radius: 5px;
    }
    @media screen and (max-width: 768px) {
        width: ${({ $minimized }) => ($minimized ? '17vh' : 'auto')};
        height: ${({ $minimized }) => ($minimized? '15vh' : 'auto')};
        aspect-ratio: auto;
        border-radius: 10px; 
        font-size: 3.0vh;
    }
`;

export const MachineName = styled.h3<{ minimized?: boolean }>`
    font-size: ${({ minimized }) => (minimized ? "3.5vh" : "3.5vh")};
    font-weight: 600;
    color: #000;
    text-transform: uppercase;
    font-family: Montserrat;
    text-align: center;
`;

export const StatusText = styled.p<{ $area?: string, $minimized?: boolean }>`
    font-size: ${({ $minimized }) => ($minimized ? "1.3vh" : "2.2vh")};
    color: #000;
    text-align: center;
    text-jusitfy: center;
    font-family: Montserrat;
    font-weight: 600;
`;

export const ProgressBar = styled.div<{$horizontal?: boolean}>`
    width: 10%;
    height: 100%;
    background-color: ${whiteA.whiteA11};
    border-radius: 1vw;
    border: 1px solid #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    ${props => props.$horizontal && `
        width: auto;
        height: 10%;
        min-height: 10px;
        flex-direction: row;
        justify-content: flex-start;
    `}
`;

export const Progress = styled.div<{ $progress: number, $horizontal?: boolean }>`
    width: 100%;
    height: ${props => props.$progress}%;
    background-color: green;
    border-radius: 1vw;
    ${props => props.$horizontal && `
        width: ${props.$progress}%;
        height: 10%;
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
export const ListIcon = styled.div<{ $symbol?: string }>`
    height: 100%;
    aspect-ratio: 1 / 1;

    background-image: url(src/assets/img/symbols/${props => props.$symbol}.svg);
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