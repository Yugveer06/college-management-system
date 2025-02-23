import { columns, FacultyRow } from "@/components/faculties-view/columns";
import { DataTable } from "@/components/faculties-view/data-table";
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

const facultySchema = z.object({
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
	designation: z
		.string()
		.min(2, "Designation must be at least 2 characters")
		.max(100, "Designation cannot exceed 100 characters"),
	qualification: z
		.string()
		.min(2, "Qualification must be at least 2 characters")
		.max(100, "Qualification cannot exceed 100 characters"),
});
type FacultyFormValues = z.infer<typeof facultySchema>;

const AddFacultyDialog = ({
	isOpen,
	onClose,
	onDataChange,
}: {
	isOpen: boolean;
	onClose: () => void;
	onDataChange: () => Promise<void>;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<FacultyFormValues>({
		resolver: zodResolver(facultySchema),
		defaultValues: {
			username: "",
			first_name: "",
			last_name: "",
			address: "",
			phone: "",
			email: "",
			password: "",
			designation: "",
			qualification: "",
		},
	});

	// Reset form when dialog closes
	useEffect(() => {
		if (!isOpen) {
			form.reset();
		}
	}, [isOpen, form]);

	const addFaculty = async (formData: FacultyFormValues) => {
		console.log("Adding faculty with data:", formData);
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
			role: "faculty",
		};

		const { data: profileDataResponse, error: profileError } =
			await supabase
				.from("profiles")
				.insert([{ id: data!.user!.id, ...profileData }]);

		if (profileError) {
			console.error("Error adding profile entry:", profileError);
			return;
		}

		const facultyData = {
			designation: formData.designation,
			qualification: formData.qualification,
		};

		const { data: facultyDataResponse, error: facultyError } =
			await supabase
				.from("faculties")
				.insert([{ id: data!.user!.id, ...facultyData }]);

		if (facultyError) {
			console.error("Error adding faculty entry:", facultyError);
			return;
		}

		console.log("User created and entries added successfully:", {
			user: data,
			profileDataResponse,
			facultyDataResponse,
		});
	};

	const onSubmit = async (data: FacultyFormValues) => {
		try {
			setIsLoading(true);
			await addFaculty(data);
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
					<DialogTitle>Add Faculty</DialogTitle>
					<DialogDescription>
						Enter the details of new faculty below.
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
								<FormField
									control={form.control}
									name='designation'
									render={({ field }) => (
										<FormItem className='flex flex-col'>
											<FormLabel>Designation</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='qualification'
									render={({ field }) => (
										<FormItem className='flex flex-col'>
											<FormLabel>Qualification</FormLabel>
											<FormControl>
												<Input {...field} />
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
	const [data, setData] = useState<FacultyRow[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();
	const [addFacultyDialogOpen, setAddFacultyDialogOpen] = useState(false);

	const fetchData = async () => {
		try {
			setIsLoading(true);

			const { data, error } = await supabase
				.from("faculties")
				.select(`*,...profiles(*)`);

			if (error) {
				console.error("Error fetching faculties:", error);
			} else {
				console.log("Faculty list with full profile data:", data);
			}

			const transformedData = data?.map((user: any) => ({
				id: user.id,
				avatar: user.avatar,
				first_name: user.first_name,
				last_name: user.last_name,
				designation: user.designation,
				address: user.address,
				qualification: user.qualification,
				username: user.username,
				email: user.email,
				phone: user.phone,
				role: user.role,
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
				<h1 className='text-2xl font-bold'>Faculties</h1>
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
										setAddFacultyDialogOpen(true)
									}
									className='bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all'
								>
									Add Faculty
								</RippleButton>
								<AddFacultyDialog
									isOpen={addFacultyDialogOpen}
									onClose={() =>
										setAddFacultyDialogOpen(false)
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
