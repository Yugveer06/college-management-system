import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
} from "./dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

type ImageViewerContextType = {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	imageSrc: string;
};

const ImageViewerContext = React.createContext<
	ImageViewerContextType | undefined
>(undefined);

const useImageViewer = () => {
	const context = React.useContext(ImageViewerContext);
	if (!context) {
		throw new Error("useImageViewer must be used within an ImageViewer");
	}
	return context;
};

interface ImageViewerProps {
	children: React.ReactNode;
	imageSrc: string;
}

const ImageViewer = ({ children, imageSrc }: ImageViewerProps) => {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<ImageViewerContext.Provider value={{ isOpen, setIsOpen, imageSrc }}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				{children}
			</Dialog>
		</ImageViewerContext.Provider>
	);
};

const ImageViewerTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
	return (
		<DialogTrigger asChild>
			<button
				ref={ref}
				className={cn(
					"inline-flex items-center justify-center",
					className
				)}
				{...props}
			>
				{children}
			</button>
		</DialogTrigger>
	);
});
ImageViewerTrigger.displayName = "ImageViewerTrigger";

const ImageViewerContent = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	const { imageSrc } = useImageViewer();

	return (
		<DialogContent
			showClose={false}
			className='!gap-0 p-0 bg-transparent outline-none shadow-none border-none'
		>
			<DialogHeader className='flex items-center justify-between flex-row bg-white p-4 rounded-t-xl'>
				<div className='flex flex-col gap-1'>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription className='text-xs'>
						{description}
					</DialogDescription>
				</div>
				<DialogClose>
					<X size={20} />
				</DialogClose>
			</DialogHeader>
			<div className='relative p-0'>
				<div className='overflow-auto p-1 bg-white rounded-b-2xl'>
					<Avatar>
						<AvatarImage
							src={imageSrc}
							alt={"Profile Picture"}
							className='w-full object-contain rounded-xl'
						/>
						<AvatarFallback className='bg-neutral-100 border border-neutral-300'>
							{description
								.split(" ")[0]
								.split("")[0]
								?.toUpperCase()}
							{description
								.split(" ")[1]
								.split("")[0]
								?.toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</div>
			</div>
		</DialogContent>
	);
};

const ImageViewerOverlay = React.forwardRef<
	React.ElementRef<typeof DialogOverlay>,
	React.ComponentPropsWithoutRef<typeof DialogOverlay>
>(({ className, ...props }, ref) => (
	<DialogOverlay
		ref={ref}
		className={cn("bg-black/80", className)}
		{...props}
	/>
));
ImageViewerOverlay.displayName = "ImageViewerOverlay";

ImageViewer.Trigger = ImageViewerTrigger;
ImageViewer.Content = ImageViewerContent;
ImageViewer.Overlay = ImageViewerOverlay;

export { ImageViewer };
