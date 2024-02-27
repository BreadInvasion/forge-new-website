import React, { useEffect, useState } from 'react';
import { 
    NavMenuRoot,
    NavMenuList,
    ListItem,
    NavMenuTrigger,
    NavMenuContent,
    Link,
    Separator,
    LogoLink,
    ForgeLogo,
    CaretDown,
    Indicator,
    Arrow,
    MobileMenuButton,
    MobileNavMenu,
    MobileNavTrigger,
    MobileNavPortal,
    MobileNavScrollArea,
    MobileNavScrollViewport,
    Tag,
    Text,
    MobileNavScrollBar,
    MobileNavContent,
    CaretRight,
    TagGroup,
    // MobileNavContent,
    // MobileNavItem,
    // MobileNavSeparator,
    // MobileNavLabel,
} from './NavComponents';
import { useRecoilState } from 'recoil';
import { isMenuOpenState } from 'src/GlobalAtoms';
import { List } from '@radix-ui/react-navigation-menu';



/**
 * To Do:
 * - [ ] Replace placeholder links with actual links
 * - [ ] Mobile responsiveness
 * - [ ] Add User Icon
 * - [ ] Add User Menu
 * - [ ] Adopt Autodesk's "Product" dropdown menu - replace Top products
 *       with "3D Print", then add all types of printers underneath, and so on
 *       (This'll get rid of Sewing, and make the main machines more noticable)
 * 
 */

const MobileNav = () => {

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isLearnOpen, setIsLearnOpen] = useState(false);

    return (
            <MobileNavMenu>
                <MobileNavTrigger>
                    <MobileMenuButton />
                </MobileNavTrigger>
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
                    <Link href="/">3D Printing Guide</Link>
                    <Link href="/">Laser Engraving Guide</Link>
                    <Link href="/">Sticker Preparation</Link>
                    <Link href="/">Troubleshooting</Link>
                </NavMenuContent>
            </ListItem>
            <ListItem>
                <Link href="/">Hours</Link>
            </ListItem>
            <Separator horizontal={false}/>
            <ListItem>
                <Link href="/">Login</Link>
            </ListItem>

            <Indicator>
                <Arrow />
            </Indicator>
        </NavMenuList>
    )
}

export const NavBar = () => {


    //TO DO: Transfer isMobile and all that to the app to handle, rather than nav
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 900);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <NavMenuRoot isMobile={isMobile}>

            {isMobile && <MobileNav />}
            
            <LogoLink href="/">
                <ForgeLogo />
                {!isMobile && "The Forge"}
            </LogoLink>

            {!isMobile && <DesktopNav />}

        </NavMenuRoot>
    )
}
