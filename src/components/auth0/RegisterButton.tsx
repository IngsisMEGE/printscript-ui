import { useAuth0 } from "@auth0/auth0-react";
import {Button} from "@mui/material";

const RegisterButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Button
            sx={{
                my: 2,
                color: 'white',
                display: 'flex',
                justifyContent: "center",
                gap: "4px",
                backgroundColor: 'primary.light',
                "&:hover": {
                    backgroundColor: 'primary.dark'
                }
            }}
            onClick={() =>
                loginWithRedirect({
                    authorizationParams: {
                        screen_hint: "signup",
                    },
                })
            }
        >
            Sign up
        </Button>
    );
};

export default RegisterButton;