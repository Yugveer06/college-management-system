import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
	BookCopy,
	BookUser,
	CalendarDays,
	ChevronUp,
	LayoutGrid,
	ListCheck,
	LoaderCircle,
	Menu,
	University,
	User2,
	Users,
} from "lucide-react";
import { motion as m } from "motion/react";
import React, { JSX } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { RippleButton } from "../ui/ripple-button/ripple-button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	useSidebar,
} from "../ui/sidebar";
import { UserRole } from "@/types/auth";

function SidebarLayout() {
	const { profile, logout } = useAuth();
	const location = useLocation();

	return (
		<>
			<SidebarProvider className='w-screen bg-gray-100'>
				<Sidebar variant='floating'>
					<SidebarHeader>
						<SidebarMenu>
							<SidebarMenuItem>
								<Link
									to='/'
									className='flex items-center gap-2 p-2 rounded'
								>
									<img
										src='/logo.png'
										alt='PMS Logo'
										className='w-8'
									/>
									<h1 className='text-lg font-bold text-emerald-800'>
										CMS
									</h1>
								</Link>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarHeader>
					<SidebarContent>
						{groups.map(group => {
							return (
								<SidebarGroup key={group.id}>
									<SidebarGroupLabel>
										{group.name}
									</SidebarGroupLabel>
									<SidebarGroupContent>
										<SidebarMenu>
											{group.items.map(item => {
												if (
													item.subitems &&
													(!item.subitems ||
														item.subitems.length ===
															0)
												) {
													return null;
												}

												return (
													<SidebarMenuItem
														key={
															item.href ||
															item.title
														}
													>
														{item.subitems ? (
															<Collapsible
																defaultOpen
																className={cn(
																	"group/collapsible rounded-md",
																	location.pathname.includes(
																		item.id
																	) &&
																		"bg-emerald-100/20 border border-emerald-50"
																)}
															>
																<CollapsibleTrigger
																	asChild
																>
																	<SidebarMenuSubButton
																		asChild
																	>
																		<RippleButton
																			variant='ghost'
																			className='active:scale-95 transition-all font-normal w-full justify-start'
																		>
																			<div className='flex gap-2 items-center'>
																				{
																					item.icon
																				}
																				<span>
																					{
																						item.title
																					}
																				</span>
																			</div>
																		</RippleButton>
																	</SidebarMenuSubButton>
																</CollapsibleTrigger>
																{location.pathname.includes(
																	item.id
																) && (
																	<m.div
																		layoutId='activeItemIndicator'
																		className='rounded-full absolute top-0 -left-1.5 h-full w-0.5 bg-emerald-500'
																	/>
																)}
																<CollapsibleContent className='space-y-1 flex flex-col'>
																	<SidebarMenuSub>
																		{item.subitems!.map(
																			subItem => (
																				<SidebarMenuSubItem
																					className='relative'
																					key={
																						subItem.href
																					}
																				>
																					<SidebarMenuSubButton
																						asChild
																					>
																						<RippleButton
																							variant='ghost'
																							className={cn(
																								"active:scale-95 transition-all p-0 font-normal w-full justify-start",
																								location.pathname ===
																									subItem.href &&
																									"bg-emerald-100/40 border border-emerald-100",
																								location.pathname.includes(
																									item.id
																								) &&
																									"hover:bg-emerald-100"
																							)}
																						>
																							<Link
																								to={
																									subItem.href
																								}
																								className='relative flex items-center justify-start p-2 w-full h-full'
																							>
																								<div className='flex gap-2 items-center'>
																									{
																										subItem.icon
																									}
																									<span>
																										{
																											subItem.title
																										}
																									</span>
																								</div>
																							</Link>
																						</RippleButton>
																					</SidebarMenuSubButton>
																					{location.pathname ===
																						subItem.href && (
																						<m.div
																							initial={{
																								opacity: 0,
																							}}
																							animate={{
																								opacity: 1,
																							}}
																							exit={{
																								opacity: 0,
																							}}
																							layoutId={`activeSubItem${
																								item
																									.subitems?.[0]
																									?.id ||
																								""
																							}Indicator`}
																							className='rounded-full absolute top-0 -left-3 h-full w-0.5 bg-emerald-500'
																						/>
																					)}
																				</SidebarMenuSubItem>
																			)
																		)}
																	</SidebarMenuSub>
																</CollapsibleContent>
															</Collapsible>
														) : (
															<SidebarMenuButton
																asChild
															>
																<>
																	<RippleButton
																		variant='ghost'
																		className={cn(
																			"active:scale-95 transition-all p-0 font-normal w-full justify-start",
																			location.pathname ===
																				item.href &&
																				"bg-emerald-100/40 border border-emerald-100 hover:bg-emerald-100"
																		)}
																	>
																		<Link
																			to={
																				item.href ||
																				"#"
																			}
																			className='flex items-center justify-start p-2 w-full h-full'
																		>
																			<div className='flex gap-2 items-center'>
																				{
																					item.icon
																				}
																				<span>
																					{
																						item.title
																					}
																				</span>
																			</div>
																		</Link>
																	</RippleButton>
																	{location.pathname ===
																		item.href && (
																		<m.div
																			layoutId='activeItemIndicator'
																			className='rounded-full absolute top-0 -left-1.5 h-full w-0.5 bg-emerald-500'
																		/>
																	)}
																</>
															</SidebarMenuButton>
														)}
													</SidebarMenuItem>
												);
											})}
										</SidebarMenu>
									</SidebarGroupContent>
								</SidebarGroup>
							);
						})}
					</SidebarContent>
					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<div>
											<SidebarMenuButton
												className={cn(
													location.pathname.startsWith(
														"/dashboard/profile"
													) &&
														"bg-emerald-100/40 border border-emerald-100 hover:bg-emerald-100"
												)}
											>
												<User2 />
												{profile ? (
													profile?.username
												) : (
													<LoaderCircle className='animate-spin' />
												)}
												<ChevronUp className='ml-auto' />
											</SidebarMenuButton>
											{location.pathname.startsWith(
												"/dashboard/profile"
											) && (
												<div className='rounded-full absolute top-0 -left-1.5 h-full w-0.5 bg-emerald-500' />
											)}
										</div>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										side='top'
										className='w-[--radix-popper-anchor-width]'
									>
										{/* <DropdownMenuItem asChild>
											<Link to='/dashboard/profile'>
												Profile
											</Link>
										</DropdownMenuItem> */}
										<DropdownMenuItem onClick={logout}>
											<span>Sign out</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				</Sidebar>

				<div className='flex flex-1 flex-col min-w-0'>
					<MobileHeader />
					<main className='flex-1 min-w-0'>
						<Outlet />
					</main>
				</div>
			</SidebarProvider>
		</>
	);
}

// Add this new component
function MobileHeader() {
	const { toggleSidebar } = useSidebar();

	return (
		<div className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden'>
			<RippleButton
				variant='ghost'
				size='icon'
				className='md:hidden'
				onClick={toggleSidebar}
			>
				<div className='flex gap-2 items-center'>
					<Menu className='h-6 w-6' />
					<span className='sr-only'>Toggle Sidebar</span>
				</div>
			</RippleButton>
			<h1 className='font-semibold'>PMS</h1>
		</div>
	);
}

type SubItem = {
	id: string;
	title: string;
	href: string;
	icon: JSX.Element;
	allowedRoles?: UserRole[];
};

type MenuItem = {
	id: string;
	title: string;
	href?: string;
	icon: JSX.Element;
	allowedRoles?: UserRole[];
	subitems?: SubItem[];
};

type Group = {
	id: string;
	name: string;
	items: MenuItem[];
	allowedRoles?: UserRole[];
};

const groups: Group[] = [
	{
		id: "app",
		name: "App",
		items: [
			{
				id: "dashboard",
				title: "Dashboard",
				href: "/dashboard",
				icon: <LayoutGrid />,
			},
		],
	},
	{
		id: "details",
		name: "Details",
		items: [
			{
				id: "students",
				title: "Students",
				icon: <BookUser />,
				href: "/dashboard/students",
			},
			{
				id: "faculties",
				title: "Faculties",
				icon: <Users />,
				href: "/dashboard/faculties",
			},
			{
				id: "departments",
				title: "Departments",
				icon: <University />,
				href: "/dashboard/departments",
			},
			{
				id: "courses",
				title: "Courses",
				icon: <BookCopy />,
				href: "/dashboard/courses",
			},
		],
	},
	{
		id: "other",
		name: "Other",
		items: [
			{
				id: "attendance",
				title: "Attendance",
				href: "/dashboard/attendance",
				icon: <ListCheck />,
				allowedRoles: ["admin"],
			},
			{
				id: "timeTable",
				title: "Time Table",
				href: "/dashboard/time-table",
				icon: <CalendarDays />,
				allowedRoles: ["admin"],
			},
		],
	},
];

export default SidebarLayout;
