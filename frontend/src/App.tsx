import React from 'react';
import AppRoutes from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

let partyMode: boolean = false;
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
let pressedKeys: string[] = [];

document.addEventListener('keydown', (event) => {
    pressedKeys.push(event.key);
    pressedKeys = pressedKeys.slice(-konamiCode.length);
    if (JSON.stringify(pressedKeys) === JSON.stringify(konamiCode)) {
        partyMode = !partyMode;
        const all = document.querySelectorAll('*');
        all.forEach(element => {
            if (partyMode) {element.classList.add('party-mode');}
            else {element.classList.remove('party-mode');}
        })
    }
});

const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppRoutes />
        </QueryClientProvider>
    );
}
