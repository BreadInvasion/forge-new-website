import React, { useEffect } from 'react';
import SVG from 'src/assets/img/logo.svg?react';
import { useRecoilState } from 'recoil';
import { screenState, pageState } from 'src/GlobalAtoms';
import styled from 'styled-components';
import { MOBILE_SIZE, ScreenTypes } from 'src/Constants';

const Nav = styled.div.attrs((props: any) => ({
    ...props,
    page: props.page,
}))<{page?: string}>`
    height: 3.25rem;
    width: 100%;
    background: ${props => props.page === 'home' || props.page === 'home-new' ? 'transparent' : '#eee'};
    position: absolute;
    top: 0;
    left: 0;
    
    &:after {
        ${props => props.page === 'home' || props.page === 'home-new' ? '' : `
            background: #AF0909;
            height: 4px;
            width: 100%;
            display: grid;
            content: '';
        `};
    }

    @media (max-width: ${MOBILE_SIZE}px) {
        height:3.75rem;
        background: #AF0909;
        font-size: 1.25rem;

        &:after {}
    };
    font-family: "Nova Square", sans-serif;
`;

const Logo = styled(SVG).attrs((props: any) => ({
    ...props,
    page: props.page,
}))<{page?: string}>`
    display: ${props => props.page === 'home' || props.page === 'home-new' ? 'none' : 'inline'};
    height: 1.75rem;
    float: left;
    margin: 1rem 0 0.5rem 3rem;
    cursor: pointer;
`;

const Links = styled.ul`
    list-style-type: none;
    margin: 0;
    padding-top: 1rem;
    margin-right: 3rem;

    @media (max-width: ${MOBILE_SIZE}px) {
        padding-top: 3.75rem;
        padding-left: 0;
        margin: 0;
    };
`;

const Link = styled.li.attrs((props: any) => ({
    ...props,
    page: props.page,
}))<{page?: string}>`
    float: right;
    margin-right: 1.75rem;
    display: block;

    font-family: 'Roboto Condensed', sans-serif;
    font-size: 1.25rem;
    text-decoration: none;
    font-weight: 700;
    cursor: pointer;
    color: #222;

    &:hover {
        color: ${props => props.page === 'home' || props.page === 'home-new' ? '#000000b0' : '#000000b0'};
    }

    @media (max-width: ${MOBILE_SIZE}px) {
        height: 3rem;
        width: 100%;
        padding-top: 1rem;
        padding-left: 1rem;
        margin: 0;
        color: #FFF;
        float: left;
        background-color: #AF0909;
    };
`;


// Write the CSS needed to make a "bars" icon"
const Menu = styled.div`
    display: none;
    float: right;
    margin-right: 1rem;
    margin-top: 1rem;
    cursor: pointer;
    color: #000000cc;
    font-size: 1.5rem;

    @media (max-width: ${MOBILE_SIZE}px) {
        display: block;
    };
`;

const MenuIcon = styled.div`
    height: 2px;
    width: 1.5rem;
    background: #000000cc;
    margin: 0.25rem 0;
`;



/* Writing a custom navbar to have more control over the states and functions */
export const NavBar = () => {

    const [page, setPage] = useRecoilState(pageState);

    const changePage = (link: string) => {
        setPage(link);
        
        const newURL = `${window.location.origin}/${link.replace(' ', '')}`;
        window.history.pushState({}, "", newURL);
    };

    const [screen, setScreen] = useRecoilState(screenState);

    /* Change the screen size based on the width of the window */
    const handleResize = () => {
        if (window.innerWidth < MOBILE_SIZE) {
            setScreen(ScreenTypes.MOBILE);
        } else {
            setScreen(ScreenTypes.DESKTOP);
        }
    };

    /* Create an event listener for when people resize a desktop (-_-) */
    useEffect(() => {
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener('resize', handleResize);
    });

    return (
        <Nav page={page} >
            {screen === ScreenTypes.DESKTOP && <Logo page={page} onClick={() => changePage('home')} />}
            {screen !== ScreenTypes.DESKTOP && (
                <Menu onClick={() => setScreen(screen === ScreenTypes.MOBILE ? ScreenTypes.MOBILE_EXPANDED : ScreenTypes.MOBILE)}>
                    <MenuIcon />
                    <MenuIcon />
                    <MenuIcon />
                </Menu>
            )}
            {screen !== ScreenTypes.MOBILE && 
                <Links>
                    <Link page={page} onClick={() => changePage('login')}>
                        Log In
                    </Link>
                    <Link page={page} onClick={() => changePage('hours')}>
                        Hours
                    </Link>
                    <Link page={page} onClick={() => changePage('news')}>
                        News
                    </Link>
                    <Link page={page} onClick={() => changePage('status')}>
                        Status
                    </Link>

                </Links>
            }
        </Nav>
    );

};

