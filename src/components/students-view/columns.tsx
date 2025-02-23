import { supabase } from "@/hooks/useSupabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Clipboard, LoaderCircle, Pen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
import { ImageViewer } from "../ui/image-viewer";
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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type StudentRow = {
	id: string;
	avatar: string;
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	phone: string;
	enrollment_number: string;
	role: number;
};

const studentEditSchema = z.object({
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
	department_id: z.number(),
});

type StudentEditFormValues = z.infer<typeof studentEditSchema>;

const EditStudentDialog = ({
	isOpen,
	onClose,
	studentData,
	onDataChange,
}: {
	isOpen: boolean;
	onClose: () => void;
	studentData: any;
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

	const form = useForm<StudentEditFormValues>({
		resolver: zodResolver(studentEditSchema),
		defaultValues: {
			username: studentData?.username || "",
			first_name: studentData?.first_name || "",
			last_name: studentData?.last_name || "",
			address: studentData?.address || "",
			phone: studentData?.phone || "",
			email: studentData?.email || "",
			department_id: studentData?.department_id,
		},
	});

	useEffect(() => {
		if (isOpen && studentData) {
			form.reset({
				username: studentData.username,
				first_name: studentData.first_name,
				last_name: studentData.last_name,
				address: studentData.address,
				phone: studentData.phone,
				email: studentData.email,
				department_id: studentData.department_id,
			});
		}
	}, [isOpen, studentData, form]);

	const onSubmit = async (data: StudentEditFormValues) => {
		try {
			setIsLoading(true);
			// Update profiles table
			const { error: profileError } = await supabase
				.from("profiles")
				.update({
					username: data.username,
					first_name: data.first_name,
					last_name: data.last_name,
					phone: data.phone,
					email: data.email,
					address: data.address,
				})
				.eq("id", studentData.id);

			if (profileError) throw profileError;

			// Update students table for department_id
			const { error: studentError } = await supabase
				.from("students")
				.update({
					department_id: data.department_id,
				})
				.eq("id", studentData.id);

			if (studentError) throw studentError;

			await onDataChange();
			onClose();
		} catch (error) {
			console.error("Error updating student:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[720px] max-h-screen overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Edit Student</DialogTitle>
					<DialogDescription>
						Update the student's information.
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

export const columns: ColumnDef<StudentRow>[] = [
	{
		accessorKey: "id",
		header: "ID",
		enableColumnFilter: true,
		enableSorting: false,
		filterFn: "includesString",
		size: 120,
		cell: function Cell({ row }) {
			const id: string = row.getValue("id");
			const [copied, setCopied] = useState(false);
			const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(
				null
			);

			const handleCopy = () => {
				void navigator.clipboard.writeText(id);
				setCopied(true);
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				const newTimeoutId = setTimeout(() => setCopied(false), 2000);
				setTimeoutId(newTimeoutId);
			};

			return (
				<div className='flex items-center gap-2 whitespace-nowrap'>
					<RippleButton
						tooltip={id}
						variant='secondary'
						size='sm'
						className='active:scale-95 transition-all h-auto border border-slate-200 px-2 py-1.5 dark:border-slate-700'
						onClick={handleCopy}
					>
						<div>
							{copied ? (
								<Check size={20} />
							) : (
								<Clipboard size={20} />
							)}
						</div>
					</RippleButton>
				</div>
			);
		},
	},
	{
		accessorKey: "avatar",
		header: "Avatar",
		cell: function Cell({ row }) {
			const avatar: string = row.getValue("avatar");
			return (
				<div className='flex items-center gap-2'>
					<ImageViewer imageSrc={avatar}>
						<ImageViewer.Trigger>
							<Avatar>
								<AvatarImage
									src={avatar}
									alt={row.getValue("first_name")}
								/>
								<AvatarFallback className='bg-neutral-100 border border-neutral-300'>
									{(row.getValue("first_name") as string)
										.split("")[0]
										.toUpperCase()}
									{(row.getValue("last_name") as string)
										.split("")[0]
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>
						</ImageViewer.Trigger>
						<ImageViewer.Overlay className='backdrop-blur-[36px] bg-neutral-950/5' />
						<ImageViewer.Content
							title='Profile Picture'
							description={
								((row.getValue("first_name") as string) +
									" " +
									row.getValue("last_name")) as string
							}
						></ImageViewer.Content>
					</ImageViewer>
				</div>
			);
		},
	},
	{
		accessorKey: "first_name",
		header: "First Name",
		enableHiding: true,
	},
	{
		accessorKey: "last_name",
		header: "Last Name",
		enableHiding: true,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: function Cell({ row }) {
			return (
				<div className='text-left'>
					{row.getValue("first_name") as string}{" "}
					{row.getValue("last_name") as string}
				</div>
			);
		},
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: function Cell({ row }) {
			return (
				<div className='text-left'>
					{row.getValue("email") as string}
				</div>
			);
		},
	},
	{
		accessorKey: "phone",
		header: "Phone",
		cell: function Cell({ row }) {
			return (
				<div className='text-left'>
					{row.getValue("phone") as string}
				</div>
			);
		},
	},
	{
		accessorKey: "department",
		header: "Department",
		cell: function Cell({ row }) {
			return (
				<div className='text-left'>
					{row.getValue("department") as string}
				</div>
			);
		},
	},
	{
		accessorKey: "action",
		header: "Actions",
		enableSorting: false,
		size: 100,
		enableHiding: true,
		cell: function Cell({ row }) {
			const id: string = row.getValue("id");
			const [deleteLoader, setDeleteLoader] = useState(false);
			const [editDialogOpen, setEditDialogOpen] = useState(false);

			const onDataChange = async () => {
				return new Promise<void>(resolve => {
					window.location.reload();
					resolve();
				});
			};

			async function onDelete() {
				try {
					setDeleteLoader(true);
					const { error: studentError } = await supabase
						.from("students")
						.delete()
						.eq("id", id);

					if (studentError) {
						console.error(
							"Error deleting student entry:",
							studentError
						);
						return;
					}

					const { error: deleteUserError } =
						await supabase.auth.admin.deleteUser(id);

					if (deleteUserError) {
						console.error("Error deleting user:", deleteUserError);
						await onDataChange();
						return;
					}

					console.log(
						"User and associated entries deleted successfully"
					);
					await onDataChange();
				} catch (error) {
					setDeleteLoader(false);
					console.error(error);
				}
			}

			return (
				<div className='flex lg:flex-row flex-col items-center gap-2'>
					<RippleButton
						variant={"secondary"}
						size={"sm"}
						className='w-full lg:w-fit active:scale-95 transition-all h-auto border border-slate-200 dark:border-slate-700 p-0'
						onClick={() => setEditDialogOpen(true)}
					>
						<div className='flex items-center justify-center w-full px-2 py-1.5'>
							<Pen size={20} />
						</div>
					</RippleButton>
					<EditStudentDialog
						isOpen={editDialogOpen}
						onClose={() => setEditDialogOpen(false)}
						studentData={row.original}
						onDataChange={onDataChange}
					/>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<RippleButton
								variant={"destructive"}
								size={"sm"}
								className='w-full lg:w-fit active:scale-95 transition-all h-auto border border-slate-200 px-2 py-1.5 dark:border-slate-700'
							>
								<Trash size={20} />
							</RippleButton>
						</AlertDialogTrigger>
						<AlertDialogContent className='p-0 flex w-[96vw] max-w-[512px] flex-col rounded-lg border border-neutral-200 bg-neutral-50 gap-0'>
							<AlertDialogHeader className='flex gap-4 rounded-t-lg bg-neutral-200/50 p-4'>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
							</AlertDialogHeader>
							<AlertDialogDescription className='p-4'>
								This action cannot be undone. This will
								permanently delete the user account and remove
								their data from our servers.
							</AlertDialogDescription>
							<AlertDialogFooter className='p-4'>
								<AlertDialogCancel asChild>
									<RippleButton
										variant='outline'
										className='h-8 rounded-md px-3 text-xs'
									>
										Cancel
									</RippleButton>
								</AlertDialogCancel>
								<AlertDialogAction asChild>
									<RippleButton
										variant='destructive'
										className='h-8 rounded-md px-3 text-xs bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90'
										onClick={onDelete}
										disabled={deleteLoader}
									>
										{deleteLoader ? (
											<LoaderCircle className='animate-spin' />
										) : (
											"Delete User"
										)}
									</RippleButton>
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			);
		},
	},
];
