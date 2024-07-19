import { useAuth0 } from "@auth0/auth0-react";
import {Avatar} from "@mui/material";

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (
            <Avatar
                sx={{
                    my: 2,
                    display: 'flex',
                    justifyContent: "center",
                    gap: "4px",
                    backgroundColor: 'transparent',
                    "&:hover": {
                        backgroundColor: 'primary.dark'
                    }
                }}
                src={user?.picture} alt={user?.name}
            />
        )
    );
};

export default Profile;