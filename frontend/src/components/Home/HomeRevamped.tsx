import { styled } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'
import {ReactComponent as SVG} from 'src/assets/img/logo.svg';
import React from 'react';
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
import { DESCRIPTION_TEXT, LOCATION_TEXT, MOBILE_DESCRIPTION_TEXT, ROOM_TEXT, ScreenTypes } from 'src/Constants';
import { useRecoilState, useRecoilValue } from 'recoil';
import { pageState, screenState } from 'src/GlobalAtoms';

import background from 'src/assets/img/anvil_with_benchys_right.png'


const Cover = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
 
    background-image:  url(${background}), linear-gradient(100deg, #E90000 15.74%, #878787 80.3%);
    background-size: cover;
    background-position: center;
`;

const CoverText = styled.div`
    display: flex;
    width: 50%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;

    font-family: 'Montserrat', sans-serif;
`;


const Title = styled.h1`
    font-size: 7.5rem;
    margin: 0;
`;



export default function HomeRevamped() {

    return (
        <Cover>
            <CoverText>
                <Title>THE FORGE</Title>
            </CoverText>
        </Cover>
    );
}
