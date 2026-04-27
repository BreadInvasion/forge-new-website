import React from 'react';
import { useResetRecoilState } from 'recoil';
import { userNameState, userState } from 'src/GlobalAtoms';
import { User } from 'src/interfaces';
import * as NavMenu from '@radix-ui/react-navigation-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import * as Avatar from '../MyForge/components/Avatar';
import * as Hamburger from './Hamburger';
import { isAdmin } from '../Auth/roleUtils';
import { ReactComponent as ForgeSVG } from 'src/assets/img/RPI_Lockup_Eng_Sm.svg'

import './styles/UserMenu.scss';
import './styles/NavBar.scss';

// ---------------------------------------------------------------------------
// Figma asset URLs (hosted for 7 days after code generation).
// TODO: Download these images and replace with local imports, e.g.:
//   import rpiLockupImg from 'src/assets/img/home/rpi_lockup.png';
//   import forgeStickerImg from 'src/assets/img/home/forge_sticker_logo.png';
// ---------------------------------------------------------------------------
const RPI_LOCKUP_IMG = 'C:\Users\Julia Camman\Downloads\site\forge-new-website\frontend\src\assets\img\RPI_Lockup_Eng_Sm.svg';
const FORGE_STICKER_IMG = 'https://www.figma.com/api/mcp/asset/8aed9ba2-5b57-42ab-bd78-7b3f6d4e02e6';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface NavBarProps {
    user: User;
    setAuth: (value: boolean) => void;
    isAuthed: boolean;
}

// ---------------------------------------------------------------------------
// User menu (sign-in / signed-in dropdown) — unchanged logic
// ---------------------------------------------------------------------------
const UserMenu: React.FC<NavBarProps> = ({ user, setAuth, isAuthed }) => {
    const setDefaultUser = useResetRecoilState(userState);

    const onSignOut = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('token_expiration');
        setAuth(false);
        setDefaultUser();
    };

    if (isAuthed) {
        return (
            <NavMenu.Item className="user-item">
                <NavMenu.Trigger className="user-trigger">
                    <Avatar.default user={user} isNav={true} />
                    {user.RCSID} <CaretDownIcon className="caret-down dropdown-spinner" aria-hidden />
                </NavMenu.Trigger>
                <NavMenu.Content className="user-content">
                    <NavMenu.Link className="link" href="/myforge">Summary</NavMenu.Link>
                    <NavMenu.Link className="link" href="/" onSelect={() => onSignOut()}>Logout</NavMenu.Link>
                </NavMenu.Content>
            </NavMenu.Item>
        );
    }

    return (
        <NavMenu.Item className="sign-in-button">
            <NavMenu.Link className="link" href="/login">Sign In</NavMenu.Link>
        </NavMenu.Item>
    );
};

// ---------------------------------------------------------------------------
// NavBar
// ---------------------------------------------------------------------------
export const NavBar: React.FC<NavBarProps> = ({ user, setAuth, isAuthed }) => {
    return (
        <NavMenu.Root className="nav-menu-root" delayDuration={1000}>

            {/* ── Left: Branding ─────────────────────────────────────── */}
            <NavMenu.Link className="logo-link" href="/">
                {/* RPI Engineering lockup */}
                <ForgeSVG
                    className="nav-rpi-lockup"
                />
                {/* Vertical separator */}
                <div className="nav-brand-separator" aria-hidden="true" />

                {/* Forge sticker logo */}
                <img
                    className="nav-forge-sticker"
                    src={FORGE_STICKER_IMG}
                    alt=""
                    aria-hidden="true"
                />

                {/* Wordmark */}
                <div className="logo-text">THE FORGE&nbsp;|&nbsp;The MILL</div>
            </NavMenu.Link>

            {/* ── Right: Links ────────────────────────────────────────── */}
            <NavMenu.List className="nav-menu-list">

                <NavMenu.Item className="list-item">
                    <NavMenu.Link className="link" href="/getting-started">Create</NavMenu.Link>
                </NavMenu.Item>

                <NavMenu.Item className="list-item">
                    <NavMenu.Link className="link" href="/status">Status</NavMenu.Link>
                </NavMenu.Item>

                <NavMenu.Item className="list-item">
                    <NavMenu.Link className="link" href="/hours">Hours</NavMenu.Link>
                </NavMenu.Item>

                <NavMenu.Item className="user-item">
                    <NavMenu.Trigger className="user-trigger">
                        FAQ <CaretDownIcon className="caret-down dropdown-spinner" aria-hidden />
                    </NavMenu.Trigger>
                    <NavMenu.Content className="user-content">
                        <NavMenu.Link className="link" href="/faq/etiquette">Etiquette</NavMenu.Link>
                        <NavMenu.Link className="link" href="/faq/materials">Material Information</NavMenu.Link>
                        <NavMenu.Link className="link" href="/faq/about">About Us</NavMenu.Link>
                    </NavMenu.Content>
                </NavMenu.Item>

                {isAuthed && isAdmin(user) && (
                    <NavMenu.Item className="list-item">
                        <NavMenu.Link className="link" href="/admin">Admin</NavMenu.Link>
                    </NavMenu.Item>
                )}

                <Hamburger.default showAdmin={isAuthed && isAdmin(user)} />

                {/* Vertical divider before Sign In */}
                <div className="separator horizontal" />

                <UserMenu user={user} setAuth={setAuth} isAuthed={isAuthed} />

                <NavMenu.Indicator className="indicator">
                    <div className="arrow" />
                </NavMenu.Indicator>

            </NavMenu.List>
        </NavMenu.Root>
    );
};
