import React from 'react';
import App from './App.tsx'
import './index.css'
import {createRoot} from "react-dom/client";
import {PaginationProvider} from "./contexts/paginationProvider.tsx";
import {SnackbarProvider} from "./contexts/snackbarProvider.tsx";
import {Auth0Provider} from "@auth0/auth0-react";

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Auth0Provider
            domain="dev-0et3cewhpj5hltwn.us.auth0.com"
            clientId="V6BK3ekUR9rH9aV39lkSYRWBhEWgR2kQ"
            authorizationParams={{
                audience: 'https://snippetmanager/',
                redirect_uri: window.location.origin
            }}>
            <PaginationProvider>
                <SnackbarProvider>
                    <App/>
                </SnackbarProvider>
            </PaginationProvider>
        </Auth0Provider>
    </React.StrictMode>,
)
