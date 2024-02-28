import React from 'react';
import { styled } from 'styled-components';
import { InstagramLogoIcon, EnvelopeOpenIcon } from '@radix-ui/react-icons';
import { ReactComponent as FacebookLogoIcon } from 'src/assets/img/nav-icon2.svg';

const Container = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    padding-bottom: 15px;
    padding-right: 50px;
    display: flex;
    flex-direction: row;

    @media (max-width: 450px) {
        display: none;
    }
`;

const IconContainer = styled.a`
    margin: 0 0.25rem;
    cursor: pointer;
    color: #000;
    background-color: transparent;
    width: fit-content;
    height: fit-content;
    display: flex;
    line-height: 0;
    justify-content: center;
    align-items: center;

    svg {
        width: 30px;
        height: 30px;
    }
`;



export default function Footer() {

    return (
        <Container>
            <IconContainer href="https://www.facebook.com/RPIMakerSpace/" target='_blank'>
                <FacebookLogoIcon />
            </IconContainer>
            <IconContainer href="https://www.instagram.com/the_forge_rpi/" target='_blank'>
                <InstagramLogoIcon />
            </IconContainer>
            <IconContainer href="mailto:theforge@rpi.edu" target='_blank'>
                <EnvelopeOpenIcon />
            </IconContainer>
        </Container>
    );
    
}
