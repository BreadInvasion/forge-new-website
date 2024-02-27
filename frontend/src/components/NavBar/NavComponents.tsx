import React from 'react';
import * as NavMenu from "@radix-ui/react-navigation-menu";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { styled, keyframes } from 'styled-components';
import { CaretDownIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { whiteA, grayDark, gray } from '@radix-ui/colors';
import { ReactComponent as ForgeSVG } from 'src/assets/img/logo.svg';


/* ---------------------- Variables ---------------------- */

const itemStyles = `
    text-decoration: none;
    font-family: "Roboto Condensed";
    font-weight: 700;
    border-radius: 4px;
    font-size: 1.25rem;

    padding: 0.25rem 0.5rem;
`;

const BaseColor = grayDark.gray1;
const HighlightColor = grayDark.gray3;
const BorderColor = grayDark.gray11;
const TextColor = grayDark.gray12;

const PopUpText = grayDark.gray1;
const PopUpColor = grayDark.gray12;
const PopUpHightlight = grayDark.gray11;

/* ---------------------- Animations ---------------------- */

const scaleIn = keyframes`
    from { transform: rotateX(-30deg) scale(0.9); opacity: 0; }
    to { transform: rotateX(0deg) scale(1); opacity: 1; }
`;

const scaleOut = keyframes`
    from { transform: rotateX(0deg) scale(1); opacity: 1; }
    to { transform: rotateX(-10deg) scale(0.95); opacity: 0; }
`;

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const fadeOut = keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
`;

const rotateIn = keyframes`
    from { transform: rotate(-90deg); }
    to { transform: rotate(-180deg); }
`;

const rotateOut = keyframes`
    from { transform: rotate(-180deg); }
    to { transform: rotate(-90deg); }
`;

/* ---------------------- Base NavMenu Children ---------------------- */

export const NavMenuRoot = styled(NavMenu.Root)<{ isMobile?: boolean;}>`
    display: flex;
    justify-content: ${props => props.isMobile ? 'left' : 'space-between'};
    width: 100%;
    min-height: 60px;
    height: 8%;

    border-bottom: 2px solid ${BorderColor};
    background-color: ${BaseColor};
`;

export const NavMenuList = styled(NavMenu.List)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    height: 100%;
    gap: 1.75rem;
    list-style: none;
    padding: 10px 20px;
`;

export const ListItem = styled(NavMenu.Item)`
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

export const NavMenuTrigger = styled(NavMenu.Trigger)`
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

export const Link = styled(NavMenu.Link)`
    ${itemStyles};
    color: inherit;
`;

export const LogoLink = styled(NavMenu.Link)`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.3125rem;
    padding: 10px 20px;

    text-decoration: none;
    color: ${TextColor};
    font-family: Montserrat;
    font-size: 1.875rem;
    font-weight: 700;
    text-transform: uppercase;
`;

export const NavMenuContent = styled(NavMenu.Content)`
    position: absolute;
    top: 100%;
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

    transition: width, height, 250ms ease;
    &[data-state=open] {
        animation: ${scaleIn} 200ms ease;
    }
    &[data-state=closed] {
        animation: ${scaleOut} 200ms ease;
    }
`;

export const Indicator = styled(NavMenu.Indicator)`
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 10px;
    overflow: hidden;
    top: 48px;
    z-index: 1;
    transition: width, transform 250ms ease;

    &[data-state=visible] {
        animation: ${fadeIn} 200ms ease;
    }
    &[data-state=hidden] {
        animation: ${fadeOut} 200ms ease;
    }
`;

/* ---------------------- Mobile Dropdown ---------------------- */


export const MobileNavMenu = styled(Dropdown.Root)`

`;

export const MobileNavTrigger = styled(Dropdown.Trigger)`
    align-items: center;
    justify-content: center;
    width: fit-content;
    padding-left: 20px;
    background-color: transparent;
    color: ${BaseColor};
    outline: none;
    border: none;
`;

export const MobileNavPortal = styled(Dropdown.Portal)`
    position: fixed;
    z-index: 1000;
`;

export const MobileNavScrollArea = styled(ScrollArea.Root)`
    height: 100vh;
    width: fit-content;
    overflow: hidden;
    padding: 0.5rem 0.5rem;
    background-color: ${grayDark.gray2};
    border-right: 2px solid ${grayDark.gray11};
    border-top: 2px solid ${grayDark.gray11};
`;

export const MobileNavScrollViewport = styled(ScrollArea.Viewport)`
    width: 100%;
    height: 100%;
    gap: 0.5rem;
`;

export const MobileNavScrollBar = styled(ScrollArea.Scrollbar)`
    display: flex;
    user-select: none;
    touch-action: none;
    padding: 2px;
    background: ${grayDark.gray6};
    transition: background 160ms ease-out;

    &:hover {
        background: ${grayDark.gray7};
    }
    width: 10px;
`;

export const MobileNavScrollThumb = styled(ScrollArea.Thumb)`
    flex: 1;
    background: ${grayDark.gray9};
    border-radius: 10px;
    position: relative;
`;

export const MobileNavContent = styled(Dropdown.Content)`
    display: flex;
    flex-direction: column;
`;


/* ---------------------- Other Components ---------------------- */

export const Arrow = styled.div`
    position: relative;
    top: 50%;
    background-color: ${PopUpColor};
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
`;

export const CaretDown = styled(CaretDownIcon)`
    color: ${grayDark.gray12};
    transition: transform 250ms ease;
    [data-state=open] & {
        transform: rotate(-180deg)
    };
`;

export const CaretRight = styled(CaretDownIcon)`
    color: ${grayDark.gray12};
    transform: rotate(-90deg);
    scale: 1.5;

    &[data-state=true] {
        animation: ${rotateIn} 250ms ease;
        transform: rotate(-180deg);
    };
    &[data-state=false] {
        animation: ${rotateOut} 250ms ease;
        transform: rotate(-90deg);
    };
`;

export const MobileMenuButton = styled(HamburgerMenuIcon)`
    display: flex;
    color: ${grayDark.gray12};
    cursor: pointer;
    width: 1.5rem;
    height: 1.5rem;
    transition: transform 250ms ease;
`;

export const Separator = styled.div<{ horizontal: boolean | undefined }>`
    background-color: ${grayDark.gray11};
    border-radius: 1px;

    height: ${props => props.horizontal  ? "2px" : "100%"};
    width: ${props => props.horizontal  ? "100%" : "2px"};
    margin: 0.25rem 0;
`;


export const ForgeLogo = styled(ForgeSVG)`
    height: 100%;
`;

export const Text = styled.div`
    display: flex;
    align-items: center;
    color: ${TextColor};
    font-size: 1.25rem;
    font-weight: 500;
    width: 100%;
    cursor: pointer;
    padding: 0.375rem 0.75rem;
    margin: 0.5rem 0;
    justify-content: space-between;
    border-radius: 4px;

    &:hover {
        background-color: ${HighlightColor};
    }
`;

export const TagGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

export const Tag = styled.div`
    color: ${TextColor};
    font-size: 1rem;
    font-weight: 400;
    margin-left: 0.75rem;
    padding: 0.25rem 0.5rem;
    &:hover {
        background-color: ${HighlightColor};
    }
    cursor: pointer;
`;