import { Route, Routes, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";

// Layouts
import NavbarLayout from "@/components/layouts/NavbarLayout";
import SidebarLayout from "@/components/layouts/SidebarLayout";

// Components
import ProtectedRoute from "@/components/ProtectedRoute";

// Contexts
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import DashboardHome from "@/pages/DashboardHome";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";

// Styles
import "./App.css";
import StudentsView from "./pages/StudentsView";
import FacultiesView from "./pages/FacultiesView";
import DepartmentsView from "./pages/DepartmentsView";
import CoursesView from "./pages/CoursesView";
import AttendanceView from "./pages/AttendanceView";
import TimeTableView from "./pages/TimeTableView";

function App() {
	const location = useLocation();
	return (
		<AuthProvider>
			<AnimatePresence mode='wait'>
				<Routes key={location.pathname} location={location.pathname}>
					<Route path='/' element={<NavbarLayout />}>
						<Route index element={<Home />} />
						<Route path='login' element={<Login />} />
						<Route
							path='forgot-password'
							element={<ForgotPassword />}
						/>
						<Route
							path='reset-password/:token'
							element={<ResetPassword />}
						/>
						<Route path='*' element={<NotFound />} />
					</Route>
					<Route path='/dashboard' element={<SidebarLayout />}>
						<Route
							index
							element={
								<ProtectedRoute>
									<DashboardHome />
								</ProtectedRoute>
							}
						/>
						<Route
							path='students'
							element={
								<ProtectedRoute>
									<StudentsView />
								</ProtectedRoute>
							}
						/>
						<Route
							path='faculties'
							element={
								<ProtectedRoute>
									<FacultiesView />
								</ProtectedRoute>
							}
						/>
						<Route
							path='departments'
							element={
								<ProtectedRoute>
									<DepartmentsView />
								</ProtectedRoute>
							}
						/>
						<Route
							path='courses'
							element={
								<ProtectedRoute>
									<CoursesView />
								</ProtectedRoute>
							}
						/>
						<Route
							path='attendance'
							element={
								<ProtectedRoute>
									<AttendanceView />
								</ProtectedRoute>
							}
						/>
						<Route
							path='time-table'
							element={
								<ProtectedRoute>
									<TimeTableView />
								</ProtectedRoute>
							}
						/>
					</Route>
				</Routes>
			</AnimatePresence>
		</AuthProvider>
	);
}

export default App;
