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
    @media screen and (max-width: 850px) {
        /* don't force full viewport height on mobile: let toolbar and sidebar size naturally */
        height: auto;
    }
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
    overflow-y: auto;
    /* ensure padding remains visible on narrow viewports even if global rules exist */
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    }
`;

export const Card = styled.div<{
    $symbol?: string;
    $minimized?: boolean;
    $highlightFailed?: boolean;
    $failed?: boolean;
    progress: number;
}>`
    /* ── Figma small card ── */
    background: #ffffff;
    border-radius: 5px;
    border: 1px solid ${({ $highlightFailed, $failed }) => ($highlightFailed || $failed ? '#a51c1c' : '#2d4a80')};
    box-shadow: ${({ $highlightFailed, $failed }) =>
        $highlightFailed || $failed
            ? '0 0 8px 2px rgba(165,28,28,0.5)'
            : '0 1px 4px rgba(17,28,54,0.10)'};
    padding: ${({ $minimized }) => ($minimized ? '10px 10px 18px 10px' : '18px 20px 20px 20px')};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: ${({ $minimized }) => ($minimized ? '200px' : '100%')};
    min-width: ${({ $minimized }) => ($minimized ? '180px' : '0')};
    flex-shrink: ${({ $minimized }) => ($minimized ? '0' : '1')};
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.15s ease, transform 0.15s ease;

    /* progress fill at bottom — minimized cards only */
    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: ${({ $failed, progress }) => $failed ? '100%' : `${progress}%`};
        height: ${({ $minimized }) => ($minimized ? '10px' : '0')};
        background: ${({ $failed }) => $failed ? '#a51c1c' : '#2d9c5c'};
        border-radius: 0 6px 0 0;
        transition: width 1s linear;
    }

    &:hover {
        box-shadow: 0 3px 12px rgba(17,28,54,0.18);
        transform: translateY(-1px);
    }

    @media screen and (max-width: 850px) {
        width: ${({ $minimized }) => ($minimized ? '180px' : '100%')};
    }
`;

export const BigCardAttribute = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: left;
    gap: 0.25rem;
`;

export const BigCardText = styled.p<{ $minimized?: boolean, $clearable?: boolean }>`
    font-size: ${({ $minimized }) => ($minimized ? '10px' : '12px')};
    font-weight: 700;
    color: #64748b;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    margin: 0;
    line-height: 1.3;
`;
export const BigCardInfo = styled.div<{ $area?: string, $minimized?: boolean, $clearable?: boolean }>`
    font-size: ${({ $minimized }) => ($minimized ? '11px' : '14px')};
    font-weight: 500;
    color: #111c36;
    margin: 0;
    line-height: 1.3;
`;

export const MachineName = styled.h3<{ $minimized?: boolean, $clearable?: boolean }>`
    font-size: ${({ $minimized }) => ($minimized ? '15px' : '20px')};
    font-weight: 700;
    color: #111c36;
    text-transform: uppercase;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    letter-spacing: 0.6px;
    line-height: 1.2;
    margin: 0 0 6px 0;
    text-align: center;
    width: 100%;
`;

export const StatusText = styled.p<{ $area?: string, $minimized?: boolean, $clearable?: boolean }>`
    font-size: ${({ $minimized }) => ($minimized ? '10px' : '12px')};
    color: #64748b;
    font-weight: 500;
    line-height: 1.3;
    margin: 0;
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