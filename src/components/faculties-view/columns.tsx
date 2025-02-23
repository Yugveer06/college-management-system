import { supabase } from "@/hooks/useSupabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Clipboard, LoaderCircle, Pen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type FacultyRow = {
	id: string;
	avatar: string;
	first_name: string;
	last_name: string;
	username: string;
	address: string;
	designation: string;
	qualification: string;
	email: string;
	phone: string;
	role: number;
};

const facultySchema = z.object({
	username: z.string().min(3).max(50),
	first_name: z.string().min(2).max(50),
	last_name: z.string().min(2).max(50),
	address: z.string().min(5).max(200).optional(),
	phone: z.string().regex(/^\+?[1-9]\d{9,14}$/),
	email: z.string().email().max(100),
	designation: z.string().min(2).max(100),
	qualification: z.string().min(2).max(100),
});

type FacultyFormValues = z.infer<typeof facultySchema>;

const EditFacultyDialog = ({
	isOpen,
	onClose,
	facultyData,
	onDataChange,
}: {
	isOpen: boolean;
	onClose: () => void;
	facultyData: any;
	onDataChange: () => Promise<void>;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<FacultyFormValues>({
		resolver: zodResolver(facultySchema),
		defaultValues: {
			username: facultyData?.username || "",
			first_name: facultyData?.first_name || "",
			last_name: facultyData?.last_name || "",
			address: facultyData?.address || "",
			phone: facultyData?.phone || "",
			email: facultyData?.email || "",
			designation: facultyData?.designation || "",
			qualification: facultyData?.qualification || "",
		},
	});

	useEffect(() => {
		if (isOpen && facultyData) {
			form.reset({
				username: facultyData.username,
				first_name: facultyData.first_name,
				last_name: facultyData.last_name,
				address: facultyData.address,
				phone: facultyData.phone,
				email: facultyData.email,
				designation: facultyData.designation,
				qualification: facultyData.qualification,
			});
		}
	}, [isOpen, facultyData, form]);

	const onSubmit = async (data: FacultyFormValues) => {
		try {
			setIsLoading(true);
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
				.eq("id", facultyData.id);

			if (profileError) throw profileError;

			const { error: facultyError } = await supabase
				.from("faculties")
				.update({
					designation: data.designation,
					qualification: data.qualification,
				})
				.eq("id", facultyData.id);

			if (facultyError) throw facultyError;

			await onDataChange();
			onClose();
		} catch (error) {
			console.error("Error updating faculty:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[720px] max-h-screen overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Edit Faculty</DialogTitle>
					<DialogDescription>
						Update the faculty member's information.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						{/* Same form fields as AddFacultyDialog, but without password field */}
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

export const columns: ColumnDef<FacultyRow>[] = [
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
		accessorKey: "address",
		header: "Address",
		cell: function Cell({ row }) {
			return (
				<div className='text-left'>
					{row.getValue("address") as string}
				</div>
			);
		},
	},
	{
		accessorKey: "designation",
		header: "Designation",
		cell: function Cell({ row }) {
			return (
				<div className='text-left'>
					{row.getValue("designation") as string}
				</div>
			);
		},
	},
	{
		accessorKey: "qualification",
		header: "Qualification",
		cell: function Cell({ row }) {
			return (
				<div className='text-left'>
					{row.getValue("qualification") as string}
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

			// Make onDataChange async by wrapping the reload in a Promise
			const onDataChange = async () => {
				return new Promise<void>(resolve => {
					window.location.reload();
					resolve();
				});
			};

			async function onDelete() {
				try {
					setDeleteLoader(true);
					const { error: facultyError } = await supabase
						.from("faculties")
						.delete()
						.eq("id", id);

					if (facultyError) {
						console.error(
							"Error deleting faculty entry:",
							facultyError
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
						<Link
							to={`#`}
							className='flex items-center justify-center w-full px-2 py-1.5'
							draggable='false'
						>
							<Pen size={20} />
						</Link>
					</RippleButton>
					<EditFacultyDialog
						isOpen={editDialogOpen}
						onClose={() => setEditDialogOpen(false)}
						facultyData={row.original}
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
