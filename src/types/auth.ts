export type UserRole = "admin" | "student" | "faculty";

export interface Profile {
	id: number;
	user_id: string;
	username: string;
	role: UserRole;
	created_at: string;
	update_at: string;
	avatar?: string;
}

export interface User {
	id: string;
	email: string;
	phone: string;
	profile: Profile;
}

export interface Faculty extends User {
	id: string;
	name: string;
	department_id: string;
	designation: string;
	qualification: string;
	created_at: string;
}

export interface Student extends User {
	id: string;
	name: string;
	enrollment_number: string;
	department_id: string;
	created_at: string;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean | null;
}
