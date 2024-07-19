import './App.css';
import {RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import RulesScreen from "./screens/Rules.tsx";
import {AuthenticationGuard} from "./components/auth0/AuthenticationGuard.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthenticationGuard component={HomeScreen} />
    },
    {
        path: '/rules',
        element: <AuthenticationGuard component={RulesScreen}/>
    }
]);

export const queryClient = new QueryClient()
const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    );
}

export default App;
