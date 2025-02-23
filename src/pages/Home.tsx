import { RippleButton } from "@/components/ui/ripple-button/ripple-button";
import { Play } from "lucide-react";
import { useScroll, useTransform } from "motion/react";
import { Link } from "react-router";
import { motion as m } from "motion/react";
import { useScrollToHash } from "@/hooks/useScrollToHash";
import { useAuth } from "@/contexts/AuthContext";

const services = [
	{
		emoji: "📦",
		title: "Student Management",
		description:
			"Efficiently manage student records, including admissions, attendance, and academic performance.",
	},
	{
		emoji: "🗂️",
		title: "Faculty & Staff Records",
		description:
			"Maintain detailed records of faculty and staff, including roles, schedules, and payroll.",
	},
	{
		emoji: "🔒",
		title: "Course & Enrollment Management",
		description:
			"Easily handle course creation, student enrollments, and class schedules.",
	},
	{
		emoji: "📊",
		title: "Reports and Analytics",
		description:
			"Generate insightful reports on student performance, faculty efficiency, and academic trends.",
	},
];

function Home() {
	const { isAuthenticated } = useAuth();
	useScrollToHash();
	const { scrollYProgress } = useScroll();
	const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
	const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
	const overlayOpacity = useTransform(
		scrollYProgress,
		[0, 1],
		["65%", "100%"]
	);
	const titleLetterSpacing = useTransform(
		scrollYProgress,
		[0, 1],
		["0px", "12px"]
	);

	return (
		<div className='min-h-screen w-screen overflow-hidden'>
			{/* Hero Section */}
			<section
				id='home'
				className='relative min-h-screen overflow-hidden'
			>
				<m.img
					style={{ y, scale }}
					src='/cms-bg.jpg'
					alt='College Background'
					className='absolute inset-0 w-full h-full object-cover'
				/>
				<m.div
					style={{ opacity: overlayOpacity }}
					className='pointer-events-none absolute inset-0 bg-black'
				></m.div>
				<div className='container relative mx-auto flex min-h-screen flex-col items-center justify-center gap-8 px-4 sm:px-6'>
					<div className='text-center px-4'>
						<m.h1
							style={{ letterSpacing: titleLetterSpacing }}
							className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white'
						>
							College Management System
						</m.h1>
						<p className='mt-4 text-base sm:text-lg md:text-xl text-white'>
							Simplifying Academic Management for Better Education
						</p>
					</div>
					<div className='flex items-center justify-center gap-4'>
						<RippleButton className='active:scale-95 transition-all group rounded-lg bg-emerald-600 px-6 py-3 hover:bg-emerald-700 p-0 h-fit border border-neutral-500/50'>
							<Link
								className='px-2 py-1'
								to={!isAuthenticated ? "/login" : "/dashboard"}
								draggable='false'
							>
								<div className='flex gap-2 items-center group-hover:gap-4 transition-all'>
									<span>Get started</span>
									<Play className='max-w-3 max-h-3' />
								</div>
							</Link>
						</RippleButton>
					</div>
				</div>
			</section>

			{/* About Section */}
			<section
				id='about'
				className='z-10 py-16 sm:py-20 bg-gray-100 scroll-mt-24'
			>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center text-emerald-600 mb-8 sm:mb-12'>
						About Us
					</h2>
					<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
						<div className='bg-white p-6 rounded-lg shadow-md'>
							<h3 className='text-xl font-semibold text-emerald-600 mb-4'>
								Who We Are
							</h3>
							<p className='text-gray-700'>
								A comprehensive solution designed to streamline
								college administration, ensuring seamless
								experiences for students, faculty, and staff.
							</p>
						</div>
						<div className='bg-white p-6 rounded-lg shadow-md'>
							<h3 className='text-xl font-semibold text-emerald-600 mb-4'>
								Our Mission
							</h3>
							<p className='text-gray-700'>
								To empower educational institutions with modern
								technology, improve operational efficiency, and
								enhance the academic experience.
							</p>
						</div>
						<div className='bg-white p-6 rounded-lg shadow-md'>
							<h3 className='text-xl font-semibold text-emerald-600 mb-4'>
								Why Choose Us
							</h3>
							<p className='text-gray-700'>
								We provide reliable and efficient systems that
								simplify student records, faculty management,
								and academic operations.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section
				id='services'
				className='z-10 py-16 sm:py-20 bg-white scroll-mt-24'
			>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center text-emerald-600 mb-8 sm:mb-12'>
						Our Services
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{services.map((service, index) => (
							<div
								key={index}
								className='bg-emerald-50 border-l-4 border-emerald-600 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow'
							>
								<div className='flex items-center space-x-4 mb-4'>
									<span className='text-3xl'>
										{service.emoji}
									</span>
									<h3 className='text-xl font-bold text-emerald-600'>
										{service.title}
									</h3>
								</div>
								<p className='text-gray-700'>
									{service.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<footer className='bg-gray-800 text-white py-8 md:py-12'>
				<div className='container mx-auto px-4 sm:px-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
						<div>
							<h3 className='text-lg font-semibold mb-4'>
								About CMS
							</h3>
							<p className='text-gray-400 text-sm'>
								Your trusted partner in academic management
								solutions, making student tracking and resource
								management easier.
							</p>
						</div>
						<div>
							<h3 className='text-lg font-semibold mb-4'>
								Quick Links
							</h3>
							<ul className='space-y-2 text-gray-400 text-sm'>
								<li>
									<Link
										to='/#home'
										className='hover:text-white transition-colors'
									>
										Home
									</Link>
								</li>
								<li>
									<Link
										to='/#about'
										className='hover:text-white transition-colors'
									>
										About
									</Link>
								</li>
								<li>
									<Link
										to='/#services'
										className='hover:text-white transition-colors'
									>
										Services
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className='text-lg font-semibold mb-4'>
								Contact Info
							</h3>
							<ul className='space-y-2 text-gray-400 text-sm'>
								<li>Email: info@cms.com</li>
								<li>Phone: (123) 456-7890</li>
								<li>Address: 123 College road</li>
							</ul>
						</div>
						<div>
							<h3 className='text-lg font-semibold mb-4'>
								Working Hours
							</h3>
							<ul className='space-y-2 text-gray-400 text-sm'>
								<li>Monday - Friday: 9:00 AM - 6:00 PM</li>
								<li>Saturday: 9:00 AM - 4:00 PM</li>
								<li>Sunday: Closed</li>
							</ul>
						</div>
					</div>
					<div className='border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400'>
						&copy; {new Date().getFullYear()} College Management
						System. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}

export default Home;
