"use client";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import AdminLayout from "../structure";

const usersCollection = collection(db, "users");

function page() {
	const COLORS = ["#1D809A", "#FF8042", "#00C49F", "#FFBB28", "#8884d8", "#82ca9d"];
	const [users, setUsers] = useState([]);
	const [analytics, setAnalytics] = useState({
		totalUsers: 0,
		averageAge: "N/A",
		minAge: "N/A",
		maxAge: "N/A",
		disabilityCounts: {},
		ageBarData: [],
		disabilityPieData: [],
	});

	useEffect(() => {
		if (users.length === 0) return;

		const ageData = users.map((user) => parseInt(user.age)).filter((age) => !isNaN(age));

		const disabilityCounts = {};
		users.forEach((user) => {
			if (user.disability === "none") {
				return;
			} else {
				const key = user.disability?.toLowerCase().trim() || "none";
				disabilityCounts[key] = (disabilityCounts[key] || 0) + 1;
			}
		});

		const ageBarData = [];
		for (let age of ageData) {
			const entry = ageBarData.find((a) => a.age === age);
			if (entry) entry.count += 1;
			else ageBarData.push({ age, count: 1 });
		}
		ageBarData.sort((a, b) => a.age - b.age);

		const disabilityPieData = Object.entries(disabilityCounts).map(([name, value]) => ({
			name: name.charAt(0).toUpperCase() + name.slice(1),
			value,
		}));

		setAnalytics({
			totalUsers: users.length,
			averageAge: ageData.length ? (ageData.reduce((a, b) => a + b, 0) / ageData.length).toFixed(1) : "N/A",
			minAge: ageData.length ? Math.min(...ageData) : "N/A",
			maxAge: ageData.length ? Math.max(...ageData) : "N/A",
			disabilityCounts,
			ageBarData,
			disabilityPieData,
		});
	}, [users]);

	useEffect(() => {
		const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
			const usersList = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setUsers(usersList);
		});
		return () => unsubscribe();
	}, []);

	return (
		<div className="min-h-screen bg-[#F7FAFC]">
			<AdminLayout>
				<section className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200 my-10">
					<h2 className="text-3xl font-bold mb-8 text-[#1D809A] text-center">Reports & Analytics</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
						{/* Stats Cards */}
						<div className="space-y-4">
							<div className="bg-[#EDF2F7] p-4 rounded-lg shadow-sm">
								<p className="text-sm text-gray-500">Total Registered Users</p>
								<p className="text-2xl font-semibold text-gray-800">{analytics.totalUsers}</p>
							</div>
							<div className="bg-[#EDF2F7] p-4 rounded-lg shadow-sm">
								<p className="text-sm text-gray-500">Average Age</p>
								<p className="text-xl font-semibold text-gray-800">{analytics.averageAge}</p>
							</div>
							<div className="bg-[#EDF2F7] p-4 rounded-lg shadow-sm flex justify-between">
								<div>
									<p className="text-sm text-gray-500">Minimum Age</p>
									<p className="text-lg font-semibold text-gray-800">{analytics.minAge}</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Maximum Age</p>
									<p className="text-lg font-semibold text-gray-800">{analytics.maxAge}</p>
								</div>
							</div>
						</div>

						{/* Disability List */}
						<div className="bg-[#EDF2F7] p-4 rounded-lg shadow-sm">
							<h3 className="text-lg font-semibold mb-3 text-[#1D809A]">Disability Breakdown</h3>
							<ul className="space-y-2">
								{Object.entries(analytics.disabilityCounts).map(([key, value]) => (
									<li key={key} className="text-gray-700">
										<span className="font-medium">
											{key.charAt(0).toUpperCase() + key.slice(1)}:
										</span>{" "}
										{value}
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Charts Section */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
						{/* Age Bar Chart */}
						<div className="bg-white border rounded-lg shadow p-4">
							<h3 className="text-xl font-semibold mb-4 text-center text-[#1D809A]">Age Distribution</h3>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={analytics.ageBarData}>
									<XAxis dataKey="age" />
									<YAxis allowDecimals={false} />
									<Tooltip />
									<Bar dataKey="count" fill="#1D809A" />
								</BarChart>
							</ResponsiveContainer>
						</div>

						{/* Disability Pie Chart */}
						<div className="bg-white border rounded-lg shadow p-4">
							<h3 className="text-xl font-semibold mb-4 text-center text-[#1D809A]">
								Disability Distribution
							</h3>
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										dataKey="value"
										data={analytics.disabilityPieData}
										cx="50%"
										cy="50%"
										outerRadius={100}
										label
									>
										{analytics.disabilityPieData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</section>
			</AdminLayout>
		</div>
	);
}

export default page;
