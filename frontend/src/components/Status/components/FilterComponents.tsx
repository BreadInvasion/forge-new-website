import { Separator } from "@radix-ui/react-separator";
import * as Popover from "@radix-ui/react-popover";
import styled from "styled-components";

export const ToolButton = styled.button`
    border-radius: 100%;
    height: 2rem;
    width: 2rem;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    color: black;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.4);

    &:hover, &:focus {
        background-color: rgba(0, 0, 0, 0.1);
    }


    & > svg {
        margin-left: 1px;
        margin-top: 1px;
    }
`;

export const PopoverContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = styled(Popover.Content)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 6px;
    padding: 15px;
    width: 250px;
    background-color: white;
    box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
    border: 1px solid black;
    margin-left: 10px;
`;

export const FilterSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const FilterSectionSeparator = styled(Separator)`
    height: 1px;
    width: 100%;
    background-color: black;
`;

export const FilterItem = styled.div`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 5px;
    padding: 0.5rem 0.5rem;
    border-radius: 5px;
    border: 1px solid black;
    width: fit-content;
    text-wrap: nowrap;
    cursor: pointer;
    font-family: Montserrat;
    font-size: 0.9rem;
    font-weight: 500;

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
        
    &[data-state="active"] {
        border: 1px solid #91dfeb;
        background-color: #edfdff;
        color: #007185;
        font-weight: bold;  
        cursor: default;          
    }
`;

export const FilterX = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90%;
    aspect-ratio: 1;
    cursor: pointer;
    font-weight: bold;
`;

export const FilterSectionTitle = styled.div`
    font-weight: bold;
    font-size: 1rem;
    font-family: Montserrat;
`;

export const PopoverClose = styled(Popover.Close)`
    position: absolute;
    top: 5px;
    right: 5px;
    border-radius: 100%;
    height: 25px;
    width: 25px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: black;

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

`;

export const FilterGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;