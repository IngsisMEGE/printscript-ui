import { withAuthenticationRequired } from "@auth0/auth0-react";
import {Box, CircularProgress} from "@mui/material";

type props = {
    component: React.ComponentType<object>;
};

export const AuthenticationGuard = ({ component }: props) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
                <CircularProgress />
            </Box>
        )
    });

    return <Component />;
}