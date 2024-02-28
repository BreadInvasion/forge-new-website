import React, { useState } from 'react';
import { 
    NavMenuRoot,
    NavMenuList,
    ListItem,
    NavMenuTrigger,
    NavMenuContent,
    Link,
    Separator,
    LogoLink,
    LogoText,
    ForgeLogo,
    CaretDown,
    Indicator,
    Arrow,
    MobileMenuButton,
    MobileNavMenu,
    MobileNavTrigger,
    MobileNavScrollArea,
    MobileNavScrollViewport,
    Tag,
    Text,
    MobileNavScrollBar,
    MobileNavContent,
    CaretRight,
    TagGroup,
    SignInButton,
} from './NavComponents';



/**
 * To Do:
 * - [ ] Replace placeholder links with actual links
 * - [X] Mobile responsiveness
 * - [ ] Add User Icon
 * - [ ] Add User Menu
 * - [ ] Adopt Autodesk's "Product" dropdown menu - replace Top products
 *       with "3D Print", then add all types of printers underneath, and so on
 *       (This'll get rid of Sewing, and make the main machines more noticable)
 * 
 * - [ ] Put All related settings (eg. padding) into common variable and reference it
 * 
 * 
 * - Easter Egg? If ever hammer Icon used (For status screen, or whatever), 
 *               if user drags it to anvil logo, make noise
 */

const MobileNav = () => {

    /* Keep track of MobileNav Dropdowns Locally as they're not needed elsewhere */
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isLearnOpen, setIsLearnOpen] = useState(false);

    return (
        <MobileNavMenu>
            <MobileNavTrigger>
                <MobileMenuButton />
            </MobileNavTrigger>
            
            {/*Possibly Put this into a Portal and absolute position to (0,0) w/ an X button */}
            <MobileNavContent >
                <MobileNavScrollArea>
                    <MobileNavScrollViewport>
                        <Text>See Our Hours</Text><Separator horizontal />

                        <Text>Check Machine Status</Text><Separator horizontal />

                        <Text onClick={() => setIsCreateOpen(isCreateOpen => !isCreateOpen)}>
                            Create 
                            <CaretRight data-state={isCreateOpen}/>
                        </Text> 
                        {isCreateOpen && 
                            <TagGroup>
                                <Tag>3D Print</Tag>
                                <Tag>Laser Engrave</Tag>
                                <Tag>Print a Sticker</Tag>
                                <Tag>See All Machines</Tag>
                            </TagGroup>
                        }
                        <Separator horizontal />

                        <Text onClick={() => setIsLearnOpen(isLearnOpen => !isLearnOpen)}>
                            Learn
                            <CaretRight data-state={isLearnOpen}/>
                        </Text>
                        {isLearnOpen &&
                            <TagGroup>
                                <Tag>About Us</Tag>
                                <Tag>3D Printing Guide</Tag>
                                <Tag>Laser Engraving Guide</Tag>
                                <Tag>Sticker Preparation</Tag>
                                <Tag>Troubleshooting</Tag>
                            </TagGroup>
                        }

                    </MobileNavScrollViewport>
                    <MobileNavScrollBar />
                </MobileNavScrollArea>
            </MobileNavContent>
        </MobileNavMenu>
    )
}

const DesktopNav = () => {

    const preventHover = (event: any) => {
        const e = event as Event;
        e.preventDefault();
    }

    return (
        <NavMenuList>
            <ListItem>
                <NavMenuTrigger onPointerEnter={preventHover} onPointerLeave={preventHover} onPointerMove={preventHover}>
                    Create <CaretDown aria-hidden/>
                </NavMenuTrigger>
                <NavMenuContent onPointerEnter={preventHover} onPointerLeave={preventHover}>
                    <Link href="/">3D Print</Link>
                    <Link href="/">Laser Engrave</Link>
                    <Link href="/">Sticker Print</Link>
                    <Link href="/">See All Machines</Link>
                </NavMenuContent>
            </ListItem>
            <ListItem>
                <Link href="/">Status</Link>
            </ListItem>
            <ListItem>
                <NavMenuTrigger onPointerEnter={preventHover} onPointerLeave={preventHover} onPointerMove={preventHover}>
                    Learn <CaretDown aria-hidden/>
                </NavMenuTrigger>
                <NavMenuContent onPointerEnter={preventHover} onPointerLeave={preventHover}>
                    <Link href="/">About Us</Link>
                    <Link href="/">3D Printing Guide</Link>
                    <Link href="/">Laser Engraving Guide</Link>
                    <Link href="/">Sticker Preparation</Link>
                    <Link href="/">Troubleshooting</Link>
                </NavMenuContent>
            </ListItem>
            <ListItem>
                <Link href="/">Hours</Link>
            </ListItem>
            <Separator/>


            <Indicator>
                <Arrow />
            </Indicator>
        </NavMenuList>
    )
}

export const NavBar = () => {

    return (
        <NavMenuRoot>

            <MobileNav />
            
            <LogoLink href="/">
                <ForgeLogo />
                <LogoText>The Forge</LogoText>
            </LogoLink>

            <DesktopNav />

            {/* Need to put User Icon and Dropdown here which replaces the SignInButton after Logged in */}
            <SignInButton>
                <Link href="/">Sign In</Link>
            </SignInButton>

        </NavMenuRoot>
    )
}
