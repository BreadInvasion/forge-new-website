import './index.scss';
import { RecoilRoot } from 'recoil';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from './components/Auth/AuthContext';
import { userState } from './GlobalAtoms';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const initializeState = ({ set: set }: any) => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    set(userState, JSON.parse(storedUser));
  }
};

root.render(
    <RecoilRoot initializeState={initializeState}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RecoilRoot>
);
