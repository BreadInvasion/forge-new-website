import { styled } from 'styled-components';
import background from 'src/assets/img/anvil_with_benchys_right.png'
import { grayDark, whiteA } from '@radix-ui/colors';

//Works for 90% of phones (With the settings for background and all that) Has some trouble with tablets
const mobileBreakpoint = "850px";

export const Cover = styled.div`
    width: 100%;
    margin: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
 
    background-image:  url(${background});
    background-color: #D40000;
    
    background-size: cover;
    background-position: center;
    @media (max-width: ${mobileBreakpoint}) {
        background-position: 93% -40%;
        background-size: 110vh;
    }
`;

export const CoverText = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding-left: 5%;

    font-weight: 600;
    font-family: 'Montserrat', sans-serif;
    background: linear-gradient(90deg, #000 10%, #0000 65%);
    color: ${whiteA.whiteA11};

    @media (max-width: ${mobileBreakpoint}) {
        background: linear-gradient(0deg, #000 20%,  #0000 100%);
        justify-content: flex-end;
        padding: 15% 10%;
    }
`;


export const Title = styled.h1`
    font-size: clamp(1.5rem, calc(1.5rem + 0.926vw), 3rem);
    width: calc(5/12 * 100%);
    margin: 0.5rem 0;

    @media (max-width: ${mobileBreakpoint}) {
        width: 100%;
        margin: 0.5rem 1rem;
    }
`;

export const Subtitle = styled.h2`
    font-size: 1.25rem;
    margin: 0 1rem;

    ul {
        padding: 0.5rem 1.5rem;
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0.5rem 1rem;
    gap: 1.25rem;

    @media (min-width: ${mobileBreakpoint}) {
        display: none;
    }
`;

export const Button = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    width: 100%;
    padding: 0.5rem 0.6255rem;
    background-color: #FFF;
    color: #000;
    border-radius: 0.25rem;
    cursor: pointer;

    @media (min-width: ${mobileBreakpoint}) {
        display: none;
    }
    svg {
        width: 1.5rem;
        height: 1.5rem;
    }
`;