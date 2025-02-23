import { motion as m } from "motion/react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

// Prototype data
const departments = [
	{ id: 1, name: "Computer Science" },
	{ id: 2, name: "Mathematics" },
	{ id: 3, name: "Physics" },
];

const timetableData = {
	"Computer Science": [
		{
			id: 1,
			subject: "Data Structures",
			time: "09:00 - 10:00",
			room: "CS-101",
			faculty: "Dr. Robert Brown",
		},
		{
			id: 2,
			subject: "Database Systems",
			time: "10:15 - 11:15",
			room: "CS-102",
			faculty: "Prof. Emily Davis",
		},
		{
			id: 3,
			subject: "Web Development",
			time: "11:30 - 12:30",
			room: "CS-103",
			faculty: "Dr. James Wilson",
		},
	],
	Mathematics: [
		{
			id: 1,
			subject: "Calculus",
			time: "09:00 - 10:00",
			room: "M-201",
			faculty: "Dr. Sarah Parker",
		},
		{
			id: 2,
			subject: "Linear Algebra",
			time: "10:15 - 11:15",
			room: "M-202",
			faculty: "Prof. Michael Chang",
		},
	],
	Physics: [
		{
			id: 1,
			subject: "Mechanics",
			time: "09:00 - 10:00",
			room: "P-301",
			faculty: "Dr. Lisa Thompson",
		},
		{
			id: 2,
			subject: "Electromagnetism",
			time: "10:15 - 11:15",
			room: "P-302",
			faculty: "Prof. David Miller",
		},
	],
};

function TimeTableView() {
	const [selectedDept, setSelectedDept] = useState("Computer Science");
	const [date, setDate] = useState(new Date());

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
			<header className='flex justify-between items-start mb-8'>
				<div className='flex flex-col items-start'>
					<h1 className='text-2xl font-bold'>Time Table</h1>
					<span className='text-xs text-amber-600 dark:text-amber-400'>
						Prototype View - For Demo Purposes Only
					</span>
				</div>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-[240px] justify-start text-left font-normal",
								!date && "text-muted-foreground"
							)}
						>
							<CalendarIcon className='mr-2 h-4 w-4' />
							{date ? (
								format(date, "PPP")
							) : (
								<span>Pick a date</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-auto p-0' align='end'>
						<Calendar
							mode='single'
							selected={date}
							onSelect={date => date && setDate(date)}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</header>

			<div className='mb-6'>
				<div className='border-b border-neutral-200 dark:border-neutral-700'>
					{departments.map(dept => (
						<button
							key={dept.id}
							className={`px-4 py-2 ${
								selectedDept === dept.name
									? "border-b-2 border-blue-500"
									: ""
							}`}
							onClick={() => setSelectedDept(dept.name)}
						>
							{dept.name}
						</button>
					))}
				</div>
			</div>

			<main className='bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4'>
				<div className='space-y-4'>
					{timetableData[
						selectedDept as keyof typeof timetableData
					].map(lecture => (
						<div
							key={lecture.id}
							className='flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4'
						>
							<div className='flex-1'>
								<h3 className='font-semibold text-lg'>
									{lecture.subject}
								</h3>
								<p className='text-sm text-neutral-500'>
									Faculty: {lecture.faculty}
								</p>
							</div>
							<div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
								<div className='px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-md'>
									<p className='text-sm'>{lecture.time}</p>
								</div>
								<div className='px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-md'>
									<p className='text-sm'>
										Room: {lecture.room}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</main>
		</m.div>
	);
}

export default TimeTableView;
