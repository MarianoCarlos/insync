"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, MessageSquare, Users, BarChartBig, LogOut } from "lucide-react";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
	const pathname = usePathname();
	const router = useRouter();
	const navLinks = [
		{
			label: "Gesture Library",
			href: "/admin/library",
			icon: ShieldCheck,
		},
		{
			label: "Feedback",
			href: "/admin/feedback",
			icon: MessageSquare,
		},
		{
			label: "User Management",
			href: "/admin/usermanagement",
			icon: Users,
		},
		{
			label: "Reports & Analytics",
			href: "/admin/analytics",
			icon: BarChartBig,
		},
	];

	const handleSignOut = async () => {
		try {
			await signOut(auth);

			// Remove all relevant cookies
			["isAdmin", "isLoggedIn"].forEach((name) => {
				document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
			});

			router.push("/");
		} catch (err) {
			console.error("Sign-out error:", err);
		}
	};

	return (
		<div className="flex min-h-screen bg-[#EDEDED] bg-opacity-30">
			{/* Sidebar */}
			<aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-300 text-[#1D809A] shadow-md hidden md:flex flex-col">
				<div className="p-6 border-b border-gray-200">
					<h1 className="text-2xl font-bold tracking-tight text-[#1D809A]">InSync Admin</h1>
				</div>

				<nav className="flex-1 px-2 py-4 space-y-1">
					{navLinks.map(({ label, href, icon: Icon }) => {
						const isActive = pathname === href;
						return (
							<Link
								key={href}
								href={href}
								className={`flex items-center px-4 py-3 text-sm rounded-md transition-all duration-150 font-medium ${
									isActive
										? "bg-[#1D809A] text-white shadow"
										: "hover:bg-[#1D809A]/10 text-[#1D809A] hover:text-[#1D809A]"
								}`}
							>
								<Icon className="w-5 h-5 mr-3" />
								{label}
							</Link>
						);
					})}
					<button
						className="flex items-center px-4 py-3 text-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer"
						onClick={handleSignOut}
					>
						<LogOut className="w-5 h-5 mr-3" />
						Logout
					</button>
				</nav>
			</aside>

			{/* Main content */}
			<main className="ml-0 md:ml-64 flex-1 p-6 text-gray-800">{children}</main>
		</div>
	);
}
