import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { supabase } from "../supabase-client";
import type { Session, User } from "@supabase/supabase-js";

// 1. Define the shape of the context data
interface AuthContextType {
    session: Session | null;
    user: User | null;
    signUpNewUser: (email: string, password: string) => Promise<{ data: any; error: any }>;
    signInUser: (email: string, password: string) => Promise<{ data: any; error: any }>;
    signOut: () => Promise<{ error: any }>;
}

// 2. Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // A. Check for an active session when the app loads
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // B. Set up a listener for auth changes (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Cleanup listener on unmount
        return () => subscription.unsubscribe();
    }, []);

    // --- Auth Functions ---

    // The specific function you requested
    const signUpNewUser = async (email: string, password: string) => {
        // This communicates directly with Supabase Auth
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

    // Bundle everything into the value object
    const value = {
        session,
        user,
        signUpNewUser,
        signInUser,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 4. Custom hook to use the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
};