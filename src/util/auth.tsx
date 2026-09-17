import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
    id: string
    username: string
    email: string
}

interface AuthState {
    isAuthenticated: boolean
    user: User | null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
}

const backend_url = import.meta.env.VITE_BACKEND_URL as string;

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Restore auth state on app load
    useEffect(() => {
        const token = window.localStorage.getItem('auth-token')
        if (token) {
            // Validate token with your API
            fetch(`${backend_url}/auth/validate-token`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => response.json())
                .then((userData) => {
                    if (userData.valid) {
                        setUser(userData.user)
                        setIsAuthenticated(true)
                    } else {
                        window.localStorage.removeItem('auth-token')
                    }
                })
                .catch(() => {
                    window.localStorage.removeItem('auth-token')
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            setIsLoading(false)
        }
    }, [])

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    const login = async (username: string, password: string) => {
        // Replace with your authentication logic
        const response = await fetch(`${backend_url}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })

        if (response.ok) {
            const userData = await response.json()
            setUser(userData)
            setIsAuthenticated(true)
            // Store token for persistence
            window.localStorage.setItem('auth-token', userData.token)
        } else {
            throw new Error('Authentication failed')
        }
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        window.localStorage.removeItem('auth-token')
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }
        }>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}