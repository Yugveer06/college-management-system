import { supabase } from "@/hooks/useSupabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { LoaderCircle, Pen, Trash } from "lucide-react";
import { useState } from "react";
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

export type DepartmentRow = {
	id: number;
	name: string;
	description: string;
};

const departmentSchema = z.object({
	name: z.string().min(2).max(100),
	description: z.string().min(5).max(500).optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

const EditDepartmentDialog = ({
	isOpen,
	onClose,
	departmentData,
	onDataChange,
}: {
	isOpen: boolean;
	onClose: () => void;
	departmentData: DepartmentRow;
	onDataChange: () => Promise<void>;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<DepartmentFormValues>({
		resolver: zodResolver(departmentSchema),
		defaultValues: {
			name: departmentData?.name || "",
			description: departmentData?.description || "",
		},
	});

	const onSubmit = async (data: DepartmentFormValues) => {
		try {
			setIsLoading(true);
			const { error } = await supabase
				.from("departments")
				.update(data)
				.eq("id", departmentData.id);
			if (error) throw error;
			await onDataChange();
			onClose();
		} catch (error) {
			console.error("Error updating department:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Edit Department</DialogTitle>
					<DialogDescription>
						Make changes to department information below.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
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

export const columns: ColumnDef<DepartmentRow>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: function Cell({ row }) {
			return (
				<div className='text-left'>{row.getValue("id") as string}</div>
			);
		},
		sortingFn: "auto",
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: function Cell({ row }) {
			return (
				<div className='text-left'>
					{row.getValue("name") as string}
				</div>
			);
		},
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: function Cell({ row }) {
			return (
				<div className='text-left'>
					{row.getValue("description") as string}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: function Cell({ row }) {
			const department = row.original;
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
						.from("departments")
						.delete()
						.eq("id", department.id);
					if (error) throw error;
					await onDataChange();
				} catch (error) {
					console.error("Error deleting department:", error);
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
					<EditDepartmentDialog
						isOpen={editDialogOpen}
						onClose={() => setEditDialogOpen(false)}
						departmentData={department}
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
									permanently delete the department and its
									data.
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
