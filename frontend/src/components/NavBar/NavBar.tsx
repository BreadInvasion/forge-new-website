import React from "react";
import { useResetRecoilState } from "recoil";
import { userNameState, userState } from "src/GlobalAtoms";
import { User } from "src/interfaces";
import * as NavMenu from "@radix-ui/react-navigation-menu";
import { CaretDownIcon } from "@radix-ui/react-icons";
import * as Avatar from "../MyForge/components/Avatar";
import * as Hamburger from "./Hamburger";
import { UserPermission } from "src/enums";
import forgeLockupUrl from "../../assets/img/RPI_Lockup_Eng_Sm.svg?url";
import forgeLogoUrl from "src/assets/img/logo.svg?url";
import "./styles/UserMenu.scss";
import "./styles/NavBar.scss";

interface NavBarProps {
  user: User;
  setAuth: (value: boolean) => void;
  isAuthed: boolean;
}

const UserMenu: React.FC<NavBarProps> = ({ user, setAuth, isAuthed }) => {
  const setDefaultUser = useResetRecoilState(userState);

  const onSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("token_expiration");
    setAuth(false);
    setDefaultUser();
  };
  if (isAuthed) {
    return (
      <NavMenu.Item className="user-item">
        <NavMenu.Trigger className="user-trigger">
          <Avatar.default user={user} isNav={true} />
          {user.RCSID}{" "}
          <CaretDownIcon className="caret-down dropdown-spinner" aria-hidden />
        </NavMenu.Trigger>
        <NavMenu.Content className="user-content">
          <NavMenu.Link className="link" href="/myforge">
            Summary
          </NavMenu.Link>
          <NavMenu.Link className="link" href="/" onSelect={(e) => onSignOut()}>
            Logout
          </NavMenu.Link>
        </NavMenu.Content>
      </NavMenu.Item>
    );
  } else {
    return (
      <NavMenu.Item className="sign-in-button">
        <NavMenu.Link className="link" href="/login">
          Sign In
        </NavMenu.Link>
      </NavMenu.Item>
    );
  }
};

const ADMIN_PERMISSIONS = Object.values(UserPermission).filter(
  (p) => p !== UserPermission.IS_SUPERUSER,
);

const isAdmin = (user: User): boolean => {
  if (!Array.isArray(user?.permissions)) return false;

  const isSuperuser = user.permissions.includes(UserPermission.IS_SUPERUSER);
  if (isSuperuser) return true;

  return ADMIN_PERMISSIONS.every((permission) =>
    user.permissions.includes(permission),
  );
};

export const NavBar: React.FC<NavBarProps> = ({ user, setAuth, isAuthed }) => {
  return (
    <NavMenu.Root
      className="nav-menu-root"
      delayDuration={1000 /* Prevent closing immediately after opening */}
    >
      <NavMenu.Link className="logo-link" href="/">
        <img
          className="nav-rpi-lockup"
          src={forgeLockupUrl}
          alt="RPI Engineering lockup"
        />
        <div className="nav-brand-separator" aria-hidden="true" />
        <img
          className="nav-forge-sticker"
          src={forgeLogoUrl}
          alt="The Forge logo"
        />
        <div className="logo-text">THE FORGE&nbsp;|&nbsp;The MILL</div>
      </NavMenu.Link>

      <NavMenu.List className="nav-menu-list">
        <NavMenu.Item className="list-item">
          <NavMenu.Link className="link" href="/getting-started">
            Create
          </NavMenu.Link>
        </NavMenu.Item>
        <NavMenu.Item className="list-item">
          <NavMenu.Link className="link" href="/status">
            Status
          </NavMenu.Link>
        </NavMenu.Item>
        <NavMenu.Item className="list-item">
          <NavMenu.Link className="link" href="/hours">
            Hours
          </NavMenu.Link>
        </NavMenu.Item>
        <NavMenu.Item className="user-item nav-faq-item">
          <NavMenu.Trigger className="user-trigger">
            FAQ{" "}
            <CaretDownIcon
              className="caret-down dropdown-spinner"
              aria-hidden
            />
          </NavMenu.Trigger>
          <NavMenu.Content className="user-content">
            <NavMenu.Link className="link" href="/faq/etiquette">
              Etiquette
            </NavMenu.Link>
            <NavMenu.Link className="link" href="/faq/materials">
              Material Information
            </NavMenu.Link>
            <NavMenu.Link className="link" href="/faq/about">
              About Us
            </NavMenu.Link>
          </NavMenu.Content>
        </NavMenu.Item>

        {isAuthed && isAdmin(user) && (
          <NavMenu.Item className="list-item">
            <NavMenu.Link className="link" href="/admin">
              Admin
            </NavMenu.Link>
          </NavMenu.Item>
        )}

        <Hamburger.default showAdmin={isAuthed && isAdmin(user)} />

        <div className="separator horizontal" />

        <UserMenu user={user} setAuth={setAuth} isAuthed={isAuthed} />

        <NavMenu.Indicator className="indicator">
          <div className="arrow" />
        </NavMenu.Indicator>
      </NavMenu.List>
    </NavMenu.Root>
  );
};
