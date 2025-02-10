import { motion as m } from "motion/react";

function AttendanceView() {
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
				<h1 className='text-2xl font-bold'>Attendance</h1>
			</header>
			<main className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'></main>
		</m.div>
	);
}

export default AttendanceView;
