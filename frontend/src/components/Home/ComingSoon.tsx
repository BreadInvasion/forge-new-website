import React from 'react';
import styled from 'styled-components';
import { ReactComponent as ForgeSVG } from 'src/assets/img/logo.svg';


const Container = styled.div`
    background-color: #fff;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const ForgeLogo = styled(ForgeSVG)`
    height: 15vh;
`;

const Text = styled.h1`
    font-size: 2rem;
    marginbottom: 16px;
`;

const ComingSoon = () => {
    return (
        <Container>
            <ForgeLogo/>
            <Text>Coming Soon!</Text>
        </Container>
    );
};

export default ComingSoon;