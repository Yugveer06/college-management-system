import { supabase } from "@/hooks/useSupabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { LoaderCircle, Pen, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RippleButton } from "../ui/ripple-button/ripple-button";
import { Textarea } from "../ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export type DepartmentRow = {
	id: number;
	name: string;
	description: string;
};

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

export type CourseRow = {
	id: number;
	course_code: string;
	course_name: string;
	description: string;
	credits: number;
	department: string;
	faculty: string;
	department_id: number;
	faculty_id: string;
};

export const columns: ColumnDef<CourseRow>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => (
			<div className='text-left'>{row.getValue("id")}</div>
		),
	},
	{
		accessorKey: "course_code",
		header: "Course Code",
		cell: ({ row }) => (
			<div className='text-left'>{row.getValue("course_code")}</div>
		),
	},
	{
		accessorKey: "course_name",
		header: "Name",
		cell: ({ row }) => (
			<div className='text-left'>{row.getValue("course_name")}</div>
		),
	},
	{
		accessorKey: "credits",
		header: "Credits",
		cell: ({ row }) => (
			<div className='text-center'>{row.getValue("credits")}</div>
		),
	},
	{
		accessorKey: "department",
		header: "Department",
		cell: ({ row }) => (
			<div className='text-left'>{row.getValue("department")}</div>
		),
	},
	{
		accessorKey: "faculty",
		header: "Faculty",
		cell: ({ row }) => (
			<div className='text-center'>{row.getValue("faculty")}</div>
		),
	},
	{
		id: "actions",
		cell: function Cell({ row }) {
			const course = row.original;
			const [editDialogOpen, setEditDialogOpen] = useState(false);
			const [deleteLoader, setDeleteLoader] = useState(false);

			const onDataChange = async () => {
				return new Promise<void>(resolve => {
					window.location.reload();
					resolve();
				});
			};

			async function onDelete() {
				try {
					setDeleteLoader(true);
					const { error } = await supabase
						.from("courses")
						.delete()
						.eq("id", course.id);
					if (error) throw error;
					await onDataChange();
				} catch (error) {
					console.error("Error deleting course:", error);
				} finally {
					setDeleteLoader(false);
				}
			}

			return (
				<div className='flex items-center gap-2'>
					<RippleButton
						variant={"secondary"}
						size={"sm"}
						className='active:scale-95 transition-all h-auto border border-slate-200 dark:border-slate-700 p-2'
						onClick={() => setEditDialogOpen(true)}
					>
						<Pen size={16} />
					</RippleButton>
					<EditCourseDialog
						isOpen={editDialogOpen}
						onClose={() => setEditDialogOpen(false)}
						courseData={course}
						onDataChange={onDataChange}
					/>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<RippleButton
								variant={"destructive"}
								size={"sm"}
								className='active:scale-95 transition-all h-auto border border-slate-200 p-2 dark:border-slate-700'
							>
								<Trash size={16} />
							</RippleButton>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete the course and its data.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={onDelete}
									disabled={deleteLoader}
								>
									{deleteLoader ? (
										<LoaderCircle className='animate-spin' />
									) : (
										"Delete"
									)}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			);
		},
	},
];

const EditCourseDialog = ({
	isOpen,
	onClose,
	courseData,
	onDataChange,
}: {
	isOpen: boolean;
	onClose: () => void;
	courseData: CourseRow;
	onDataChange: () => Promise<void>;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [departments, setDepartments] = useState<any[]>([]);
	const [faculties, setFaculties] = useState<any[]>([]);

	const form = useForm<CourseFormValues>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			course_code: courseData?.course_code || "",
			course_name: courseData?.course_name || "",
			description: courseData?.description || "",
			credits: courseData?.credits || 0,
			department_id: courseData?.department_id || 0,
			faculty_id: courseData.faculty_id.toString(),
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

	const onSubmit = async (data: CourseFormValues) => {
		try {
			setIsLoading(true);
			const { error } = await supabase
				.from("courses")
				.update(data)
				.eq("course_id", courseData.id);
			if (error) throw error;
			await onDataChange();
			onClose();
		} catch (error) {
			console.error("Error updating course:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Edit Course</DialogTitle>
					<DialogDescription>
						Make changes to course information below.
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
											onValueChange={value => {
												field.onChange(value);
											}}
											value={field.value?.toString()}
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
							<RippleButton
								className='active:scale-95 transition-all'
								size='sm'
								type='button'
								variant='outline'
								onClick={onClose}
								disabled={isLoading}
							>
								Cancel
							</RippleButton>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
