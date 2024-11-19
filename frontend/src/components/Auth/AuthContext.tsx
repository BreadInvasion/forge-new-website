import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { userState } from 'src/GlobalAtoms';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface CustomJwtPayload extends JwtPayload {
  expires_at?: number;
  issued_at?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [user, setUser] = useRecoilState(userState);
  const setDefaultUser = useResetRecoilState(userState);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log(token);
      const decodedToken: CustomJwtPayload = jwtDecode<JwtPayload>(token);

      // Token expiration logic
      if (decodedToken.expires_at && decodedToken.expires_at * 1000 > Date.now()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('authToken');
        setDefaultUser();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    console.log('Logging in');
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
