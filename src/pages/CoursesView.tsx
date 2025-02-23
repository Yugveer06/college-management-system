import { columns } from "@/components/courses-view/columns";
import { DataTable } from "@/components/courses-view/data-table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RippleButton } from "@/components/ui/ripple-button/ripple-button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/hooks/useSupabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { motion as m } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { z } from "zod";

const courseSchema = z.object({
	course_code: z
		.string()
		.min(2, "Course code must be at least 2 characters")
		.max(10),
	course_name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(100),
	description: z.string().min(5).max(500).optional(),
	credits: z.number().min(1).max(6),
	department_id: z.number(),
	faculty_id: z.string(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const AddCourseDialog = ({
	isOpen,
	onClose,
	onDataChange,
}: {
	isOpen: boolean;
	onClose: () => void;
	onDataChange: () => Promise<void>;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [departments, setDepartments] = useState<any[]>([]);
	const [faculties, setFaculties] = useState<any[]>([]);

	const form = useForm<CourseFormValues>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			course_code: "",
			course_name: "",
			description: "",
			credits: 0,
		},
	});

	useEffect(() => {
		const fetchDepartmentsAndFaculties = async () => {
			const { data: depts } = await supabase
				.from("departments")
				.select("*");
			const { data: facs } = await supabase
				.from("faculties")
				.select("*,profile:profiles(*)");
			setDepartments(depts || []);
			setFaculties(facs || []);
		};
		fetchDepartmentsAndFaculties();
	}, []);

	useEffect(() => {
		if (!isOpen) {
			form.reset();
		}
	}, [isOpen, form]);

	const onSubmit = async (data: CourseFormValues) => {
		console.log(data);
		try {
			setIsLoading(true);
			const { error } = await supabase.from("courses").insert([data]);
			if (error) throw error;
			await onDataChange();
			onClose();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Add Course</DialogTitle>
					<DialogDescription>
						Enter the details of new course below.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='course_code'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Code</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='course_name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											className='max-h-48'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='credits'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Credits</FormLabel>
									<FormControl>
										<Input
											type='number'
											{...field}
											onChange={e =>
												field.onChange(
													Number(e.target.value)
												)
											}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='department_id'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Department</FormLabel>
									<FormControl>
										<Select
											onValueChange={value =>
												field.onChange(Number(value))
											}
											value={
												field.value
													? field.value.toString()
													: undefined
											}
										>
											<SelectTrigger>
												<SelectValue placeholder='Department' />
											</SelectTrigger>
											<SelectContent>
												{departments.map(dept => (
													<SelectItem
														key={dept.id}
														value={dept.id.toString()}
													>
														{dept.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='faculty_id'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Faculty</FormLabel>
									<FormControl>
										<Select
											onValueChange={value =>
												field.onChange(value)
											}
											value={
												field.value
													? field.value.toString()
													: undefined
											}
										>
											<SelectTrigger>
												<SelectValue placeholder='Faculty' />
											</SelectTrigger>
											<SelectContent>
												{faculties.map(fac => (
													<SelectItem
														key={fac.id}
														value={fac.id.toString()}
													>
														{fac.profile.first_name}{" "}
														{fac.profile.last_name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<RippleButton
								size='sm'
								type='submit'
								className='bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all'
								disabled={isLoading}
							>
								{isLoading ? (
									<LoaderCircle className='animate-spin' />
								) : (
									"Save changes"
								)}
							</RippleButton>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

function CoursesView() {
	const { profile } = useAuth();
	const [data, setData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();
	const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("courses")
				.select(
					`*,department:departments(*),faculty:faculties(*,profile:profiles(*))`
				);

			const transformedData = data?.map((course: any) => ({
				id: course.course_id,
				course_code: course.course_code,
				course_name: course.course_name,
				description: course.description,
				credits: course.credits,
				department: course.department?.name || "N/A",
				faculty: course.faculty?.profile
					? `${course.faculty.profile.first_name} ${course.faculty.profile.last_name}`
					: "N/A",
				// Add these for edit functionality
				department_id: course.department_id,
				faculty_id: course.faculty_id,
			}));

			if (error) throw error;
			setData(transformedData!);
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
				<h1 className='text-2xl font-bold'>Courses</h1>
			</header>
			<main>
				{isLoading ? (
					<div className='flex justify-center items-center'>
						<LoaderCircle className='animate-spin' />
					</div>
				) : (
					<div className='flex flex-col gap-6'>
						{profile?.role === "admin" && (
							<>
								<RippleButton
									onClick={() => setAddCourseDialogOpen(true)}
									className='bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all'
								>
									Add Course
								</RippleButton>
								<AddCourseDialog
									isOpen={addCourseDialogOpen}
									onClose={() =>
										setAddCourseDialogOpen(false)
									}
									onDataChange={fetchData}
								/>
							</>
						)}
						<DataTable columns={columns} data={data} />
					</div>
				)}
			</main>
		</m.div>
	);
}

export default CoursesView;
