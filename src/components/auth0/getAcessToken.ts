import {useEffect, useState} from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const useAuthToken = (): string | null => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [jwt, setJwt] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                if (isAuthenticated) {
                    const token = await getAccessTokenSilently();
                    setJwt(token);
                }
            } catch (error) {
                console.error('Error obteniendo el token:', error);
            }
        };

        fetchToken();
    }, [getAccessTokenSilently, isAuthenticated]);

    return jwt;
};
