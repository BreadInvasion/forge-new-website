import styled from 'styled-components';
import { grayDark, whiteA } from '@radix-ui/colors';

// Works for 90% of phones (With the settings for background and all that) Has some trouble with tablets
const mobileBreakpoint = "850px";

/******************************* Prusa Shelf ******************************** */
export const StatusWrapper = styled.div`
    flex-direction: column;
    display: flex;
    width: 100%;
    height: 100%;
    overflow: visible;
`;

export const GridContainer = styled.div`
    grid-area: status;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    align-items: flex-start;
    column-gap: 10px;
    overflow: visible;
    @media screen and (max-width: 850px) {
    overflow-y: auto;}
`;

export const Card = styled.div<{ 
    $symbol?: string; 
    $minimized?: boolean; 
    $highlightFailed?: boolean; 
    progress: number;
}>`
    background-color: #f5f5f5;
    border-radius: 5px;
    padding:10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 0rem;
    width: ${({ $minimized }) => ($minimized ? 'clamp(120px, 9vw, 200px)' : 'clamp(200px, 25vw, 400px)')};
    min-width: ${({ $minimized }) => ($minimized ? '100px' : '200px')};
    max-width: 100%;
    height: ${({ $minimized }) => ($minimized ? 'clamp(15vh, 15vh, 17vh)' : 'auto')};
    aspect-ratio: auto;
    flex-shrink: 0;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    border-radius: ${({ $minimized }) => ($minimized ? '5px' : '10px')}; 
    box-shadow: ${({ $highlightFailed }) =>
        $highlightFailed ? '0 0 10px 2px red' : '0 0 5px rgba(0, 0, 0, 0.5)'};
    border: ${({ $minimized }) => ($minimized ? '1px solid #ccc' : '1px solid #999')};
    font-size: ${({ $minimized }) => ($minimized ? "2.5vh" : "3.0vh")};
    transition: all 0.3s ease-in-out;
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
    ${({ $minimized }) =>$minimized && `&:hover {    
        transform: scale(1.05); 
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); 
        }
    `}
    @media screen and (max-width: 850px) {
        width: ${({ $minimized }) => ($minimized ? '15vh' : 'auto')};
        height: ${({ $minimized }) => ($minimized? '12vh' : 'auto')};
        aspect-ratio: auto;
        border-radius: 10px; 
    }
`;

export const BigCardAttribute = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: left;
    gap: 0.25rem;
`;

export const BigCardText = styled.p<{ $minimized?: boolean }>`
    font-size: ${({ $minimized }) => ($minimized ? "1.5vh" : "2.0vh")};
    font-weight: 600;
    text-align: center;
    width: auto;
`;
export const BigCardInfo = styled.div<{ $area?: string, $minimized?: boolean }>`
    font-weight: ${({ $minimized }) => ($minimized ? "600" : "400")};
    font-size: ${({ $minimized }) => ($minimized ? "1.5vh" : "1.8vh")};
    text-align: center;
    width: auto;
    @media screen and (max-width: 850px) {
        font-size: ${({ $minimized }) => ($minimized ? "1.5vh" : "1.7vh")};
    }
`;

export const MachineName = styled.h3<{ $minimized?: boolean }>`
    font-size: ${({ $minimized }) => ($minimized ? "2.5vh" : "3.0vh")};
    font-weight: 650;
    color: #000;
    text-transform: uppercase;
    font-family: Montserrat;
    text-align: center;
`;

export const StatusText = styled.p<{ $area?: string, $minimized?: boolean }>`
    font-size: ${({ $minimized }) => ($minimized ? "1.5vh" : "2.0vh")};
    color: #000;
    text-align: center;
    text-jusitfy: center;
    font-family: Montserrat;
    font-weight: 600;
    @media screen and (max-width: 850px) {
        font-size: ${({ $minimized }) => ($minimized ? "1.5vh" : "1.7vh")};
    }
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