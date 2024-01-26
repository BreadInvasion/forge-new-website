import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styled from 'styled-components';

const _Navbar = styled(Navbar)`

    background-color: rgba(0,0,0,0);
    justify-content: flex-end;
    padding: 1rem 5rem;
    gap: 0.625rem;

    font-family: 'Roboto Condensed', sans-serif;
    font-weight: 600;
    font-size: 1.25rem;
`;

const BarBreak = styled.div`
    width: 0.25rem;
    height: 80%;
    background-color: #222;
    border-radius: 0.125rem;
`;

export default function NavBarCustom() {
    const expand = 'lg';
    return (
            <_Navbar expand={expand} fixed="top">
                {/*<Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand> */}
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
                >
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <NavDropdown
                            title="Create"
                            id={`offcanvasNavbarDropdown-expand-${expand}`}
                        >
                            <NavDropdown.Item href="/">
                            3D Printing
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/">
                            Laser Engraving
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/">
                            Sticker Printing
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/status">Status</Nav.Link>
                        <NavDropdown
                            title="Learn"
                            id={`offcanvasNavbarDropdown-expand-${expand}`}
                        >
                            <NavDropdown.Item href="/learn">3D Printing</NavDropdown.Item>
                            <NavDropdown.Item href="/learn">
                            Laser Engraving
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/learn">
                            Sticker Printing
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/hours">Hours</Nav.Link>
                        <BarBreak />
                        <Nav.Link href="/login">Sign In</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
                </Navbar.Offcanvas>
            </_Navbar>
    );
}