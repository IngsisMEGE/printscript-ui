import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import { Box, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";

type Props = {
    component: React.ComponentType<object>;
};

export const AuthenticationGuard = ({ component: Component }: Props) => {
    const { isAuthenticated, getIdTokenClaims, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const saveTokenToLocalStorage = async () => {
            if (isAuthenticated) {
                const token = await getAccessTokenSilently();
                localStorage.setItem("jwt", token);
            }
        };

        saveTokenToLocalStorage();
    }, [isAuthenticated, getIdTokenClaims]);

    return (
        <Component />
    );
};

export default withAuthenticationRequired(AuthenticationGuard, {
    onRedirecting: () => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
            <CircularProgress />
        </Box>
    )
});