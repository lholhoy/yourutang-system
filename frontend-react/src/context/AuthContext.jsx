import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axios";
import axios from "axios";

const AuthContext = createContext({
    user: null,
    token: null,
    setUser: () => { },
    setToken: () => { },
    login: () => { },
    register: () => { },
    logout: () => { },
    csrf: () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    const csrf = () => axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });

    const getUser = async () => {
        try {
            const { data } = await axiosClient.get("/user");
            setUser(data);
        } catch (error) {
            console.error(error);
        }
    };

    const login = async ({ email, password, remember }) => {
        await csrf();
        await axiosClient.post("/login", { email, password, remember });
        await getUser();
        // Sanctum uses cookies, but we might want to store a dummy token or just rely on user state
        // For this implementation, we'll rely on the user object being present
        setToken('auth');
    };

    const register = async ({ name, email, password, password_confirmation }) => {
        await csrf();
        await axiosClient.post("/register", { name, email, password, password_confirmation });
        // Do not auto-login, allow redirect to login page
    };

    const logout = async () => {
        await axiosClient.post("/logout");
        setUser(null);
        setToken(null);
    };

    useEffect(() => {
        if (token) {
            getUser();
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
