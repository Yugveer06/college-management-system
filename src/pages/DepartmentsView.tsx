import { columns } from "@/components/departments-view/columns";
import { DataTable } from "@/components/departments-view/data-table";
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

const departmentSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(100),
	description: z.string().min(5).max(500).optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

const AddDepartmentDialog = ({
	isOpen,
	onClose,
	onDataChange,
}: {
	isOpen: boolean;
	onClose: () => void;
	onDataChange: () => Promise<void>;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<DepartmentFormValues>({
		resolver: zodResolver(departmentSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	useEffect(() => {
		if (!isOpen) {
			form.reset();
		}
	}, [isOpen, form]);

	const onSubmit = async (data: DepartmentFormValues) => {
		try {
			setIsLoading(true);
			const { error } = await supabase.from("departments").insert([data]);
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
					<DialogTitle>Add Department</DialogTitle>
					<DialogDescription>
						Enter the details of new department below.
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
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

function DepartmentsView() {
	const { profile } = useAuth();
	const [data, setData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();
	const [addDepartmentDialogOpen, setAddDepartmentDialogOpen] =
		useState(false);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("departments")
				.select("*");
			if (error) throw error;
			setData(data);
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
				<h1 className='text-2xl font-bold'>Departments</h1>
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
									onClick={() =>
										setAddDepartmentDialogOpen(true)
									}
									className='bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all'
								>
									Add Department
								</RippleButton>
								<AddDepartmentDialog
									isOpen={addDepartmentDialogOpen}
									onClose={() =>
										setAddDepartmentDialogOpen(false)
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

export default DepartmentsView;
