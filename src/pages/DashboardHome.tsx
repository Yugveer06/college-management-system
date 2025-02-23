import React, { useState, useEffect } from "react";
import { motion as m } from "motion/react";
import { RippleButton } from "@/components/ui/ripple-button/ripple-button";
import { Link } from "react-router";
import { LoaderCircle } from "lucide-react";
import { supabase } from "@/hooks/useSupabase";

interface CounterState {
	students: number;
	faculties: number;
	departments: number;
	courses: number;
}

const DashboardHome: React.FC = () => {
	const [userLoader, setUserLoader] = useState<boolean>(true);
	const [stats, setStats] = useState<CounterState>({
		students: 0,
		faculties: 0,
		departments: 0,
		courses: 0,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch counts from each table
				const [
					{ count: studentsCount },
					{ count: facultiesCount },
					{ count: departmentsCount },
					{ count: coursesCount },
				] = await Promise.all([
					supabase
						.from("students")
						.select("*", { count: "exact", head: true }),
					supabase
						.from("faculties")
						.select("*", { count: "exact", head: true }),
					supabase
						.from("departments")
						.select("*", { count: "exact", head: true }),
					supabase
						.from("courses")
						.select("*", { count: "exact", head: true }),
				]);

				setStats({
					students: studentsCount || 0,
					faculties: facultiesCount || 0,
					departments: departmentsCount || 0,
					courses: coursesCount || 0,
				});
				setUserLoader(false);
			} catch (error) {
				setUserLoader(false);
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<m.div
			initial={{ opacity: 0, x: -256 }}
			animate={{
				opacity: 1,
				x: 0,
				transition: { ease: [0, 0.75, 0.25, 1] },
			}}
			exit={{
				opacity: 0,
				x: 256,
				transition: { ease: [0.75, 0, 1, 0.25] },
			}}
			className='flex-1 min-h-screen bg-neutral-100 dark:bg-neutral-950 p-6'
		>
			<header className='text-left mb-12'>
				<h1 className='text-2xl font-bold'>Dashboard</h1>
				<p>Welcome to the College Management System Dashboard</p>
			</header>
			<main className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{/* Students */}
				<RippleButton className='active:scale-[0.98] transition-all h-auto bg-white dark:bg-neutral-900 shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-blue-500'>
					<Link
						to='/dashboard/students'
						className='p-6 flex flex-col items-center justify-center w-full h-full'
						draggable={false}
					>
						<h2 className='text-xl font-bold text-blue-500 mb-2'>
							Students
						</h2>
						<p className='text-3xl font-semibold text-neutral-800 dark:text-neutral-100'>
							{userLoader ? (
								<LoaderCircle className='animate-spin' />
							) : (
								<span>{stats.students}</span>
							)}
						</p>
					</Link>
				</RippleButton>
				{/* Faculties */}
				<RippleButton className='active:scale-[0.98] transition-all h-auto bg-white dark:bg-neutral-900 shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-purple-500'>
					<Link
						to='/dashboard/faculties'
						className='p-6 flex flex-col items-center justify-center w-full h-full'
						draggable={false}
					>
						<h2 className='text-xl font-bold text-purple-500 mb-2'>
							Faculties
						</h2>
						<p className='text-3xl font-semibold text-neutral-800 dark:text-neutral-100'>
							{userLoader ? (
								<LoaderCircle className='animate-spin' />
							) : (
								<span>{stats.faculties}</span>
							)}
						</p>
					</Link>
				</RippleButton>
				{/* Departments */}
				<RippleButton className='active:scale-[0.98] transition-all h-auto bg-white dark:bg-neutral-900 shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-red-500'>
					<Link
						to='/dashboard/departments'
						className='p-6 flex flex-col items-center justify-center w-full h-full'
						draggable={false}
					>
						<h2 className='text-xl font-bold text-red-500 mb-2'>
							Departments
						</h2>
						<p className='text-3xl font-semibold text-neutral-800 dark:text-neutral-100'>
							{userLoader ? (
								<LoaderCircle className='animate-spin' />
							) : (
								<span>{stats.departments}</span>
							)}
						</p>
					</Link>
				</RippleButton>
				{/* Courses */}
				<RippleButton className='active:scale-[0.98] transition-all h-auto bg-white dark:bg-neutral-900 shadow-md hover:bg-slate-50 p-0 rounded-lg border-l-4 border-orange-500'>
					<Link
						to='/dashboard/courses'
						className='p-6 flex flex-col items-center justify-center w-full h-full'
						draggable={false}
					>
						<h2 className='text-xl font-bold text-orange-500 mb-2'>
							Courses
						</h2>
						<p className='text-3xl font-semibold text-neutral-800 dark:text-neutral-100'>
							{userLoader ? (
								<LoaderCircle className='animate-spin' />
							) : (
								<span>{stats.courses}</span>
							)}
						</p>
					</Link>
				</RippleButton>
			</main>
		</m.div>
	);
};

export default DashboardHome;
