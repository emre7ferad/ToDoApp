import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { supabase } from "../supabase-client";
import type { Session, User } from "@supabase/supabase-js";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface AuthContextType {
    session: Session | null;
    user: User | null;
    signUpNewUser: (email: string, password: string) => Promise<{ data: any; error: any }>;
    signInUser: (email: string, password: string) => Promise<{ data: any; error: any }>;
    signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUpNewUser = async (email: string, password: string) => {
        const result = await supabase.auth.signUp({
            email,
            password,
        });
        return result;
    };

    const signInUser = async (email: string, password: string) => {
        const result = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return result;
    }

    const signOut = async () => {
        return await supabase.auth.signOut();
    };

    const value = {
        session,
        user,
        signUpNewUser,
        signInUser,
        signOut,
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
};