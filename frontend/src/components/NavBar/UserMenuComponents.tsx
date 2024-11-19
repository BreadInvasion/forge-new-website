import { grayDark } from '@radix-ui/colors';
import styled, { keyframes } from 'styled-components';
import * as NavMenu from "@radix-ui/react-navigation-menu";
import { Link } from './NavComponents';

const itemStyles = `
    text-decoration: none;
    font-family: "Roboto Condensed";
    font-weight: 700;
    border-radius: 4px;
    font-size: 1.25rem;

    padding: 0.25rem 0.5rem;
`;

const BaseColor = "#000";
const HighlightColor = grayDark.gray3;
const BorderColor = grayDark.gray11;
const TextColor = grayDark.gray12;

const PopUpText = grayDark.gray1;
const PopUpColor = grayDark.gray12;
const PopUpHightlight = grayDark.gray11;

const scaleIn = keyframes`
    from { transform: rotateX(-30deg) scale(0.9); opacity: 0; }
    to { transform: rotateX(0deg) scale(1); opacity: 1; }
`;

const scaleOut = keyframes`
    from { transform: rotateX(0deg) scale(1); opacity: 1; }
    to { transform: rotateX(-10deg) scale(0.95); opacity: 0; }
`;


export const UserList = styled(NavMenu.List)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    height: 100%;
    gap: 0.25rem;
    list-style: none;
    padding: 0.75rem 0.75rem 0.75rem 0;
`;

export const LogoutButton = styled.button`
    ${itemStyles};
    background-color: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
`;

export const UserContent = styled(NavMenu.Content)`
    position: absolute;
    top: 100%;
    right: 10%;
    z-index: 1000;
    display: flex;
    flex-direction: column;

    padding: 0.25rem;
    width: max-content;
    gap: 0.5rem;
    border-radius: 4px;

    background-color: ${PopUpColor};
    color: ${PopUpText};
    box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;

    ${Link}:hover {
        background-color: ${PopUpHightlight};
    }

    ${LogoutButton}:hover {
        background-color: ${PopUpHightlight};
    }

    transition: width, height, 250ms ease;
    &[data-state=open] {
        animation: ${scaleIn} 200ms ease;
    }
    &[data-state=closed] {
        animation: ${scaleOut} 200ms ease;
    }
`;

export const UserItem = styled(NavMenu.Item)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    border-radius: 4px;
    color: ${TextColor};

    &:hover {
        background-color: ${HighlightColor};
    }
`;

export const UserTrigger = styled(NavMenu.Trigger)`
    display: flex;
    align-items: center;
    ${itemStyles};
    gap: 0.3125rem;
    border: none;
    background-color: transparent;
    color: inherit;
    cursor: pointer;

    &[data-state=open] {
        background-color: ${HighlightColor};
    }
`;
