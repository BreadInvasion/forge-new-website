import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { authState, UserInterface, userState } from 'src/GlobalAtoms';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInterface;
  setAuth: (value: boolean) => void;
  setUser: (value: UserInterface) => void;
}

interface CustomJwtPayload extends JwtPayload {
  expires_at?: number;
  issued_at?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialAuthState = (localStorage.getItem('token_expiration') &&
    Number(localStorage.getItem('token_expiration')) * 1000 > Date.now()) as boolean;
  const [isAuthenticated, setAuth] = useState<boolean>(initialAuthState);

  const initialUserData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {} as UserInterface;
  const [user, setUser] = useState<UserInterface>(initialUserData);


  const setDefaultUser = useResetRecoilState(userState);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token_expiration = localStorage.getItem('token_expiration');

    if (token_expiration && Number(token_expiration) * 1000 > Date.now()) {
      setAuth(true);
      setUser(JSON.parse(userData || '{}'));
    } else {
      setAuth(false);
      setDefaultUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
