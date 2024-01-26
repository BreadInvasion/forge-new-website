import { styled } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'
import {ReactComponent as SVG} from 'src/assets/img/logo.svg';
import React from 'react';
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
import { DESCRIPTION_TEXT, LOCATION_TEXT, MOBILE_DESCRIPTION_TEXT, ROOM_TEXT, ScreenTypes } from 'src/Constants';
import { useRecoilValue } from 'recoil';
import { screenState } from 'src/GlobalAtoms';


const Cover = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CoverText = styled.div`
    color: #FFF;
    max-width: 1000px;
    height: auto;

    font-size: 1.2em;
    font-family: 'Roboto', sans-serif;
    text-decoration: none;
    text-align: center;
`;
const Title = styled.h1`
    font-size: 6vw;
    font-family: 'Montserrat', sans-serif;
    margin-bottom: 0px;

    &:after {
        display: block;
        height: 4px;
        width: 100px;
        background: #AF0909;
        content: '';
        margin-left: auto;
        margin-right: auto;
    };
`;

const Logo = styled(SVG)`
    margin-left: auto;
    margin-right: auto;
    display: block;
    height: 10vh;
`;

const Footer = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    padding-bottom: 15px;
    padding-right: 50px;
    font-size: 2em;
`;

const IconContainer = styled.a`
    margin: 0 0.5rem;
    cursor: pointer;
`;

const Icon = styled(FontAwesomeIcon)`
    color: #FFFFFF80;
    font-weight: 400;
`;


export default function Home() {

    const screen = useRecoilValue(screenState);

    const desktop_description = 
        <p>
            <br/>
            {DESCRIPTION_TEXT}
            <br />
            <br />
            {LOCATION_TEXT}
            <strong>
                {ROOM_TEXT}
            </strong>
            <br/>
        </p>;
    const mobile_description =
        <p>
            <br/>
            {MOBILE_DESCRIPTION_TEXT}
            <br />
        </p>

    return (
        <Cover>
            <CoverText>
                <Title>THE FORGE</Title>
                {screen === ScreenTypes.DESKTOP ? desktop_description : mobile_description}
                {screen === ScreenTypes.DESKTOP ? <Logo /> : null}
            </CoverText>
            <Footer>
                <IconContainer href="https://www.facebook.com/RPIMakerSpace/" target='_blank'>
                    <Icon icon={faSquareFacebook} />
                </IconContainer>
                <IconContainer href="https://www.instagram.com/the_forge_rpi/" target='_blank'>
                    <Icon icon={faInstagram} />
                </IconContainer>
                <IconContainer href="mailto:theforge@rpi.edu" target='_blank'>
                    <Icon icon={faEnvelopeOpenText} />
                </IconContainer>
            </Footer>
        </Cover>
    );
}

