import React, { useEffect } from "react";
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import { Box, CircularProgress } from "@mui/material";

type Props = {
    component: React.ComponentType<object>;
};

export const AuthenticationGuard = ({ component }: Props) => {
    const { isAuthenticated, getIdTokenClaims } = useAuth0();

    useEffect(() => {
        const storeJwt = async () => {
            if (isAuthenticated) {
                const token = await getIdTokenClaims();
                if (token) {
                    localStorage.setItem("jwt", token.__raw);
                }
            }
        };

        storeJwt();
    }, [isAuthenticated, getIdTokenClaims]);

    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
                <CircularProgress />
            </Box>
        ),
    });

    return <Component />;
};