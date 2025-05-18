"use client";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import AdminLayout from "./structure";

const usersCollection = collection(db, "users");

function AdminHomePage() {
	const [adminName, setAdminName] = useState("Admin");
	const [totalUsers, setTotalUsers] = useState(0);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setAdminName(user.displayName || "Admin");
			}
		});

		const unsubUsers = onSnapshot(usersCollection, (snapshot) => {
			setTotalUsers(snapshot.docs.length);
		});

		return () => {
			unsubscribe();
			unsubUsers();
		};
	}, []);

	return (
		<div className="min-h-screen bg-[#EDEDED]/30">
			<AdminLayout>
				<section className="max-w-4xl mx-auto bg-white p-8 mt-8 rounded shadow border border-gray-300">
					<h1 className="text-3xl font-bold text-[#1D809A] mb-4">Welcome, {adminName}!</h1>
					<p className="text-gray-700 text-lg mb-6">
						You're logged into the admin dashboard. Here's a quick overview:
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-[#1D809A]/10 p-4 rounded-lg border border-[#1D809A]/30">
							<p className="text-[#1D809A] text-xl font-semibold">Total Users</p>
							<p className="text-3xl font-bold mt-2">{totalUsers}</p>
						</div>

						<div className="bg-[#FFBB28]/10 p-4 rounded-lg border border-[#FFBB28]/30">
							<p className="text-[#FFBB28] text-xl font-semibold">Reports & Analytics</p>
							<p className="mt-2 text-gray-700">
								View detailed user stats and charts under the "Reports & Analytics" tab.
							</p>
						</div>
					</div>
				</section>
			</AdminLayout>
		</div>
	);
}

export default AdminHomePage;
