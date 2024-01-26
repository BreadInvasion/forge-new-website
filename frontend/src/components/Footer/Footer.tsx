import { styled } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'
import React from 'react';
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
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
    color: #000000D0;
    font-weight: 400;
`;



export default function Footer() {

    return (
        <Container>
            <IconContainer href="https://www.facebook.com/RPIMakerSpace/" target='_blank'>
                <Icon icon={faSquareFacebook} />
            </IconContainer>
            <IconContainer href="https://www.instagram.com/the_forge_rpi/" target='_blank'>
                <Icon icon={faInstagram} />
            </IconContainer>
            <IconContainer href="mailto:theforge@rpi.edu" target='_blank'>
                <Icon icon={faEnvelopeOpenText} />
            </IconContainer>
        </Container>
    );
    
}
