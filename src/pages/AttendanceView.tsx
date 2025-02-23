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
import { Switch } from "@/components/ui/switch";

// Prototype data
const students = [
	{ id: 1, name: "John Doe", roll: "CS2301" },
	{ id: 2, name: "Jane Smith", roll: "CS2302" },
	{ id: 3, name: "Mike Johnson", roll: "CS2303" },
	{ id: 4, name: "Sarah Williams", roll: "CS2304" },
];

const faculty = [
	{ id: 1, name: "Dr. Robert Brown", department: "Computer Science" },
	{ id: 2, name: "Prof. Emily Davis", department: "Mathematics" },
	{ id: 3, name: "Dr. James Wilson", department: "Physics" },
];

function AttendanceView() {
	const [activeTab, setActiveTab] = useState<"students" | "faculty">(
		"students"
	);
	const [date, setDate] = useState(new Date());
	const [attendance, setAttendance] = useState<Record<string, boolean>>({});

	// New utility function to get attendance status with default "present"
	const getAttendanceStatus = (id: number): boolean => {
		const key = `${id}-${date.toDateString()}`;
		return attendance[key] === undefined ? true : attendance[key];
	};

	const toggleAttendance = (id: number) => {
		setAttendance(prev => ({
			...prev,
			[`${id}-${date.toDateString()}`]:
				!prev[`${id}-${date.toDateString()}`],
		}));
	};

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
					<h1 className='text-2xl font-bold'>Attendance</h1>
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
					<button
						className={`px-4 py-2 ${
							activeTab === "students"
								? "border-b-2 border-blue-500"
								: ""
						}`}
						onClick={() => setActiveTab("students")}
					>
						Students
					</button>
					<button
						className={`px-4 py-2 ${
							activeTab === "faculty"
								? "border-b-2 border-blue-500"
								: ""
						}`}
						onClick={() => setActiveTab("faculty")}
					>
						Faculty
					</button>
				</div>
			</div>

			<main className='bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4'>
				{activeTab === "students" ? (
					<div className='space-y-4'>
						{students.map(student => (
							<div
								key={student.id}
								className='flex items-center justify-between p-3 border rounded-lg'
							>
								<div>
									<h3 className='font-semibold'>
										{student.name}
									</h3>
									<p className='text-sm text-neutral-500'>
										Roll: {student.roll}
									</p>
								</div>
								<div className='flex items-center gap-2'>
									<span className='text-sm text-neutral-500'>
										{getAttendanceStatus(student.id)
											? "Present"
											: "Absent"}
									</span>
									<Switch
										checked={getAttendanceStatus(
											student.id
										)}
										onCheckedChange={() =>
											toggleAttendance(student.id)
										}
									/>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='space-y-4'>
						{faculty.map(f => (
							<div
								key={f.id}
								className='flex items-center justify-between p-3 border rounded-lg'
							>
								<div>
									<h3 className='font-semibold'>{f.name}</h3>
									<p className='text-sm text-neutral-500'>
										Department: {f.department}
									</p>
								</div>
								<div className='flex items-center gap-2'>
									<span className='text-sm text-neutral-500'>
										{getAttendanceStatus(f.id)
											? "Present"
											: "Absent"}
									</span>
									<Switch
										checked={getAttendanceStatus(f.id)}
										onCheckedChange={() =>
											toggleAttendance(f.id)
										}
									/>
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</m.div>
	);
}

export default AttendanceView;
