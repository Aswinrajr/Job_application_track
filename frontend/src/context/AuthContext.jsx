// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, forgotPassword } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setCurrentUser(user);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const user = await loginUser({ email, password });
            localStorage.setItem('user', JSON.stringify(user));
            setCurrentUser(user);
            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await registerUser(userData);
            // Don't log in automatically after registration
            return { success: true, message: 'Registration successful! Please log in.' };
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const resetPassword = async (email) => {
        return await forgotPassword(email);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        navigate('/login');
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}