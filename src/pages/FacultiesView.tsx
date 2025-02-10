import { supabase } from "@/hooks/useSupabase";
import { motion as m } from "motion/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

interface Faculty {
	id: number;
	department_id: string;
	designation: string;
	qualification: string;
	office_room: string;
	contact_info: {
		email: string;
		phone: string;
	};
}

function FacultiesView() {
	const [data, setData] = useState<Faculty[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("faculties")
				.select("*");

			if (error) throw error;

			setData(data);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [location.pathname]);

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{
				opacity: 1,
				scale: 1,
				transition: { ease: [0, 0.75, 0.25, 1] },
			}}
			exit={{
				opacity: 0,
				scale: 0.9,
				transition: { ease: [0.75, 0, 1, 0.25] },
			}}
			className='flex-1 min-h-screen bg-neutral-100 dark:bg-neutral-950 p-6'
		>
			<header className='text-left mb-12'>
				<h1 className='text-2xl font-bold'>Faculties</h1>
			</header>
			<main className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{isLoading ? (
					<p>Loading...</p>
				) : (
					data.map(faculty => (
						<m.div
							key={faculty.id}
							className='bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-md'
						>
							<h2 className='text-lg font-bold'>
								{faculty.department_id}
							</h2>
							<p className='text-sm text-neutral-600 dark:text-neutral-400'>
								{faculty.designation}
							</p>
							<p className='text-sm text-neutral-600 dark:text-neutral-400'>
								{faculty.office_room}
							</p>
							<p className='text-sm text-neutral-600 dark:text-neutral-400'>
								{faculty.contact_info?.email}
							</p>
							<p className='text-sm text-neutral-600 dark:text-neutral-400'>
								{faculty.contact_info?.phone}
							</p>
						</m.div>
					))
				)}
			</main>
		</m.div>
	);
}

export default FacultiesView;
