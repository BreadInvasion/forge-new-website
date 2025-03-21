import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import { useResetRecoilState } from "recoil";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { userState } from "src/GlobalAtoms";
import { AuthAPI } from "src/apis/AuthAPI";
import { User } from "src/interfaces";

import "./Auth.css"


interface AuthContextType {
    isAuthenticated: boolean;
    suppressAlertInProtectedRoute: boolean;
    user: User;
    setAuth: (value: boolean) => void;
    setUser: (value: User) => void;
    logout: () => void;
}

const LOGOUT_TIME_LIMIT = 5;    // minutes user can stay logged in
const LOGOUT_TIME_WARNING = 2;  // minutes before loguot when warning will show

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const initialAuthState = !!(
        localStorage.getItem("token_expiration") &&
        Number(localStorage.getItem("token_expiration")) * 1000 > Date.now()
    );
    const [isAuthenticated, setAuth] = useState<boolean>(initialAuthState);

    const storedUser = localStorage.getItem("user");
    const initialUserData: User = storedUser
        ? JSON.parse(storedUser)
        : ({} as User);
    const [user, setUser] = useState<User>(initialUserData);

    const setDefaultUser = useResetRecoilState(userState);

    // Needed in order to not show the alert in the protected route
    const [suppressAlertInProtectedRoute, setSuppressAlertInProtectedRoute] = useState(false);

    const [warningShown, setWarningShown] = useState(false);

    const [showWarningDialog, setShowWarningDialog] = useState(false);

    const [logoutTimerId, setLogoutTimerId] = useState<number | null>(null);

    const [lastActivity, setLastActivity] = useState<number>(Date.now());



    // -------------------------
    //       LOGOUT HELPER
    // -------------------------
    const logout = useCallback(() => {
        if (logoutTimerId) {
            clearTimeout(logoutTimerId);
            setLogoutTimerId(null);
        }

        setShowWarningDialog(false);
        setWarningShown(false);

        setSuppressAlertInProtectedRoute(true);
        setUser({} as User);
        setDefaultUser();
        localStorage.removeItem("authToken");
        localStorage.removeItem("token_expiration");
        localStorage.removeItem("user");
        setAuth(false);
    }, [setDefaultUser]);



    // -------------------------
    //       REFRESH HELPER
    // -------------------------
    const refreshToken = useCallback(async () => {
        try {
            const response = await AuthAPI.refresh();

            if (response.status === 200) {
                const result = await response.data;

                const token = result.access_token;
                const expiration = Math.floor(Date.now() / 1000) + LOGOUT_TIME_LIMIT * 60; 

                setAuth(true);
                localStorage.setItem('authToken', token);
                localStorage.setItem('token_expiration', expiration.toString() || '0');
            } else {
                console.error('Failed to refresh token:', response.status);
                logout();
            }
        } catch (error) {
            console.error('Error:', error);
            logout();
        }
    }, [logout]);



    // -------------------------
    //   HANDLE USER ACTIVITY
    // -------------------------
    const handleUserActivity = useCallback(async () => {
        if (!isAuthenticated) return;
        if (showWarningDialog) return;

        setLastActivity(Date.now());

        const tokenExp = localStorage.getItem("token_expiration");
        if (!tokenExp) return;

        const timeLeft = Number(tokenExp) * 1000 - Date.now();
        
        if (timeLeft < LOGOUT_TIME_WARNING * 60 * 1000) {
            await refreshToken();
        }

    }, [showWarningDialog, refreshToken]);

    // Attach activity listeners (mousemove, click, keydown)
    useEffect(() => {
        window.addEventListener("mousemove", handleUserActivity);
        window.addEventListener("click", handleUserActivity);
        window.addEventListener("keydown", handleUserActivity);

        return () => {
            window.removeEventListener("mousemove", handleUserActivity);
            window.removeEventListener("click", handleUserActivity);
            window.removeEventListener("keydown", handleUserActivity);
        };
    }, [handleUserActivity]);



    // -------------------------
    //  CHECK TOKEN ON MOUNT
    // -------------------------
    useEffect(() => {
        const tokenExp = localStorage.getItem("token_expiration");
        if (tokenExp && Number(tokenExp) * 1000 > Date.now()) {
            setAuth(true);
            setUser(initialUserData);
        } else {
            logout();
        }
    }, []);



    // -------------------------
    //  PERIODIC EXPIRATION CHECK
    // -------------------------
    useEffect(() => {
        if (!isAuthenticated) return;

        const intervalId = setInterval(() => {
            const tokenExp = localStorage.getItem("token_expiration");
            if (!tokenExp) {
                logout();
                return;
            }

            const timeLeft = Number(tokenExp) * 1000 - Date.now();
            if (timeLeft <= 0) {
                // token is expired => logout
                logout();
                return;
            }

            // don't warn if there was recent activity
            if (lastActivity + LOGOUT_TIME_LIMIT * 60 * 1000 < Date.now()) {
                refreshToken();
                return;
            }

            // If less than LOGOUT_TIME_WARNING minutes remain, show the Radix AlertDialog (once)
            if (timeLeft < LOGOUT_TIME_WARNING * 60 * 1000 && !warningShown) {
                setWarningShown(true);
                setShowWarningDialog(true);

                // Start a LOGOUT_TIME_WARNING-minute timer to auto-logout if no response
                const timerId = window.setTimeout(() => {
                    logout();
                }, LOGOUT_TIME_LIMIT * 60 * 1000);
                setLogoutTimerId(timerId);
            }
        }, 15_000); // check every 15s

        return () => clearInterval(intervalId);
    }, [isAuthenticated, warningShown, logout]);



    // -------------------------
    //   MODAL "STAY LOGGED IN"
    // -------------------------
    const stayLoggedIn = useCallback(async () => {
        setShowWarningDialog(false);
        setWarningShown(false);

        if (logoutTimerId) {
            clearTimeout(logoutTimerId);
            setLogoutTimerId(null);
        }

        await refreshToken();
    }, [logoutTimerId, refreshToken]);


    // ---------------
    // USER CHOOSES LOG OUT
    // ---------------
    const confirmLogout = useCallback(() => {
        logout();
    }, [logoutTimerId, logout]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                suppressAlertInProtectedRoute,
                user,
                setAuth,
                setUser,
                logout,
            }}
        >
            {/*
                Radix AlertDialog that opens automatically (no <AlertDialog.Trigger>) 
                Because we control `open` state ourselves.
            */}
            <AlertDialog.Root
                open={showWarningDialog}
                onOpenChange={(open) => {
                    // If the user closed the dialog without choosing "Stay" or "Log Out",
                    if (!open && showWarningDialog) {
                        logout();
                    }
                }}
            >
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="AlertDialogOverlay" />
                    <AlertDialog.Content className="AlertDialogContent">
                        <AlertDialog.Title className="AlertDialogTitle">
                            Your session will expire soon
                        </AlertDialog.Title>
                        <AlertDialog.Description className="AlertDialogDescription">
                            {`You have less than ${LOGOUT_TIME_WARNING} minutes remaining. Would you like to stay
                            logged in?`}
                        </AlertDialog.Description>
                        <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
                            {/* 
                                "Cancel" = STAY LOGGED IN
                                Radix will call "onOpenChange(false)" automatically. 
                            */}
                            <AlertDialog.Cancel asChild>
                                <button className="Button" onClick={(e) => {
                                    stayLoggedIn();
                                    e.preventDefault();
                                }}>
                                    Stay Logged In
                                </button>
                            </AlertDialog.Cancel>


                            <AlertDialog.Action asChild>
                                <button className="Button red" onClick={(e) => {
                                    confirmLogout();
                                    e.preventDefault();
                                }}>
                                    Log Out
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>

            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
