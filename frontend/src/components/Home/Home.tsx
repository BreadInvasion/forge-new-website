import React from 'react';
import { ExclamationTriangleIcon, Component1Icon } from '@radix-ui/react-icons';
import {
    Cover,
    CoverText,
    Title,
    Subtitle,
    ButtonContainer,
    Button,
} from './HomeComponents';



export default function Home() {

    return (
        <Cover>
            <CoverText>
                <Title>Ever wonder what magic feels like? Come to The Forge and find out!</Title>
                <Subtitle>
                    Learn the maker magic behind:
                    <ul>
                        <li>3D Printing</li>
                        <li>Laser Engraving</li>
                        <li>Sticker Printing</li>
                        <li>And More!</li>
                    </ul>
                </Subtitle>
                <ButtonContainer>
                    <Button>
                        <Component1Icon />
                        <span>Use a Machine</span>
                    </Button>
                    <Button>
                        <ExclamationTriangleIcon />
                        <span>Machine Status</span>
                    </Button>
                </ButtonContainer>
            </CoverText>
        </Cover>
    );
}
