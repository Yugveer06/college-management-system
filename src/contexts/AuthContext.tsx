import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/hooks/useSupabase";

interface AuthContextType {
	isAuthenticated: boolean | null;
	user: User | null;
	profile: any | null;
	checkAuth: () => Promise<{ isAuthenticated: boolean; user: User | null }>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
		null
	);
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<any | null>(null);

	const fetchProfile = async (userId: string) => {
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", userId)
			.single();

		if (error) {
			console.error("Error fetching user role:", error.message);
		} else {
			return data;
		}
	};

	const checkAuth = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		const isAuthenticated = !!user;
		setIsAuthenticated(isAuthenticated);
		const profile = await fetchProfile(user!.id);
		setUser(user);
		setProfile(profile);
		return { isAuthenticated, user };
	};

	useEffect(() => {
		// Check initial auth state
		checkAuth();

		// Set up auth state listener
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setIsAuthenticated(!!session);
			setUser(session?.user || null);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const logout = async () => {
		await supabase.auth.signOut();
		setIsAuthenticated(false);
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				profile,
				checkAuth,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
