import { columns, StudentRow } from "@/components/students-view/columns";
import { DataTable } from "@/components/students-view/data-table";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const studentSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(50, "Username cannot exceed 50 characters"),
	first_name: z
		.string()
		.min(2, "First name must be at least 2 characters")
		.max(50, "First name cannot exceed 50 characters"),
	last_name: z
		.string()
		.min(2, "Last name must be at least 2 characters")
		.max(50, "Last name cannot exceed 50 characters"),
	address: z
		.string()
		.min(5, "Address must be at least 5 characters")
		.max(200, "Address cannot exceed 200 characters")
		.optional(),
	phone: z
		.string()
		.regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format"),
	email: z
		.string()
		.email("Invalid email address")
		.max(100, "Email cannot exceed 100 characters"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.max(100, "Password cannot exceed 100 characters"),
	department_id: z.number(),
});
type StudentFormValues = z.infer<typeof studentSchema>;

const AddStudentDialog = ({
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

	useEffect(() => {
		const fetchDepartments = async () => {
			const { data } = await supabase.from("departments").select("*");
			setDepartments(data || []);
		};
		fetchDepartments();
	}, []);

	const form = useForm<StudentFormValues>({
		resolver: zodResolver(studentSchema),
		defaultValues: {
			username: "",
			first_name: "",
			last_name: "",
			address: "",
			phone: "",
			email: "",
			password: "",
			department_id: undefined,
		},
	});

	// Reset form when dialog closes
	useEffect(() => {
		if (!isOpen) {
			form.reset();
		}
	}, [isOpen, form]);

	const addStudent = async (formData: StudentFormValues) => {
		console.log("Adding student with data:", formData);
		const { data, error: userError } = await supabase.auth.signUp({
			email: formData.email,
			password: formData.password,
		});

		if (userError) {
			console.error("Error creating user:", userError);
			return;
		}

		const profileData = {
			username: formData.username,
			first_name: formData.first_name,
			last_name: formData.last_name,
			phone: formData.phone,
			email: formData.email,
			address: formData.address,
			role: "student",
			department_id: formData.department_id,
		};

		const { data: profileDataResponse, error: profileError } =
			await supabase
				.from("profiles")
				.insert([{ id: data!.user!.id, ...profileData }]);

		if (profileError) {
			console.error("Error adding profile entry:", profileError);
			return;
		}

		const currentYear = new Date().getFullYear().toString().slice(-2);
		const randomNum = Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, "0");
		const studentData = {
			enrollment_number: `${currentYear}${randomNum}`,
		};

		const { data: studentDataResponse, error: studentError } =
			await supabase
				.from("students")
				.insert([{ id: data!.user!.id, ...studentData }]);

		if (studentError) {
			console.error("Error adding student entry:", studentError);
			return;
		}

		console.log("User created and entries added successfully:", {
			user: data,
			profileDataResponse,
			studentDataResponse,
		});
	};

	const onSubmit = async (data: StudentFormValues) => {
		try {
			setIsLoading(true);
			await addStudent(data);
			await onDataChange(); // Refresh data after adding
			onClose();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[720px] max-h-screen overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Add Student</DialogTitle>
					<DialogDescription>
						Enter the details of new student below.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<div className='flex gap-2 flex-col md:flex-row'>
							<div className='flex flex-col gap-2 flex-1'>
								<FormField
									control={form.control}
									name='first_name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='last_name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='address'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address</FormLabel>
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
							</div>
							<div className='flex flex-col gap-2 flex-1'>
								<FormField
									control={form.control}
									name='username'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem className='flex flex-col'>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type='email'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='phone'
									render={({ field }) => (
										<FormItem className='flex flex-col'>
											<FormLabel>Phone</FormLabel>
											<FormControl>
												<Input type='tel' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem className='flex flex-col'>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type='password'
													{...field}
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
														field.onChange(
															Number(value)
														)
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
														{departments.map(
															dept => (
																<SelectItem
																	key={
																		dept.id
																	}
																	value={dept.id.toString()}
																>
																	{dept.name}
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
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

function FacultiesView() {
	const { profile } = useAuth();
	const [data, setData] = useState<StudentRow[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();
	const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);

	const fetchData = async () => {
		try {
			setIsLoading(true);

			const { data, error } = await supabase
				.from("students")
				.select(`*,profile:profiles(*),department:departments(*)`);

			if (error) {
				console.error("Error fetching students:", error);
			} else {
				console.log("Student list with full profile data:", data);
			}

			const transformedData = data?.map((user: any) => ({
				id: user.id,
				avatar: user.profile.avatar,
				first_name: user.profile.first_name,
				last_name: user.profile.last_name,
				username: user.profile.username,
				email: user.profile.email,
				phone: user.profile.phone,
				role: user.profile.role,
				department: user?.department?.name,
				enrollment_number: user.enrollment_number,
			}));

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
				<h1 className='text-2xl font-bold'>Students</h1>
			</header>
			<main>
				{isLoading ? (
					<div className='flex justify-center items-center'>
						<LoaderCircle className=' animate-spin' />
					</div>
				) : (
					<div className='flex flex-col gap-6'>
						{profile?.role === "admin" && (
							<>
								<RippleButton
									onClick={() =>
										setAddStudentDialogOpen(true)
									}
									className='bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all'
								>
									Add Student
								</RippleButton>
								<AddStudentDialog
									isOpen={addStudentDialogOpen}
									onClose={() =>
										setAddStudentDialogOpen(false)
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

export default FacultiesView;
