"use client";
import React, { useState } from "react";
import Navbar from "../../components/navbar";
import { BookOpen, ChevronRight, Search, CheckCircle, Filter, GraduationCap, Hand, Clock } from "lucide-react";

// Only ASL lesson retained
const lessons = [
	{
		id: "1",
		title: "ASL Alphabet Basics",
		description: "Learn the foundational hand shapes for each letter of the alphabet in American Sign Language.",
		level: "Beginner",
		duration: "15 min",
		completed: true,
	},
];

const Learn = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [levelFilter, setLevelFilter] = useState(null);

	const filteredLessons = lessons.filter((lesson) => {
		const matchesSearch =
			lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesLevel = levelFilter ? lesson.level === levelFilter : true;
		return matchesSearch && matchesLevel;
	});

	const resetFilters = () => {
		setSearchQuery("");
		setLevelFilter(null);
	};

	return (
		<div className="min-h-screen flex flex-col" style={{ backgroundColor: "#EDEDED", color: "#252525" }}>
			<Navbar />
			<main className="flex-1 pt-32 pb-20">
				<div className="container mx-auto px-4 md:px-6">
					<div className="max-w-5xl mx-auto">
						<div className="text-center mb-12">
							<div
								className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full"
								style={{ backgroundColor: "rgba(29, 128, 154, 0.1)", color: "#1D809A" }}
							>
								Learning Resources
							</div>
							<h1
								className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
								style={{ color: "#252525" }}
							>
								Master American Sign Language
							</h1>
							<p className="text-lg max-w-3xl mx-auto" style={{ color: "#8D9192" }}>
								Explore our ASL lesson to begin improving your signing skills.
							</p>
						</div>

						{/* Progress Section */}
						<div className="mb-12">
							<div className="bg-[#8D9192]/30 rounded-2xl p-6 md:p-8 border">
								<div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
									<div>
										<h2 className="text-xl font-semibold mb-2" style={{ color: "#252525" }}>
											Your Learning Progress
										</h2>
										<p className="text-[#8D9192]">Continue where you left off</p>
									</div>
									<div className="mt-4 md:mt-0 flex items-center">
										<div className="w-full md:w-48 h-2 bg-[#8D9192] rounded-full overflow-hidden">
											<div
												className="bg-[#1D809A] h-full rounded-full"
												style={{ width: "100%" }}
											></div>
										</div>
										<span className="ml-3 text-sm font-medium">100%</span>
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="bg-[#EDEDED] rounded-xl p-4 border shadow-sm">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-[#8D9192]">Completed</p>
												<p className="text-2xl font-semibold">1/1</p>
											</div>
											<div
												className="w-10 h-10 flex items-center justify-center rounded-lg"
												style={{ backgroundColor: "#1D809A", color: "#FFFFFF" }}
											>
												<CheckCircle size={20} />
											</div>
										</div>
									</div>
									<div className="bg-[#EDEDED] rounded-xl p-4 border shadow-sm">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-[#8D9192]">Time Spent</p>
												<p className="text-2xl font-semibold">15 min</p>
											</div>
											<div
												className="w-10 h-10 flex items-center justify-center rounded-lg"
												style={{ backgroundColor: "#1D809A", color: "#FFFFFF" }}
											>
												<Clock size={20} />
											</div>
										</div>
									</div>
									<div className="bg-[#EDEDED] rounded-xl p-4 border shadow-sm">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-[#8D9192]">Signs Learned</p>
												<p className="text-2xl font-semibold">26</p>
											</div>
											<div
												className="w-10 h-10 flex items-center justify-center rounded-lg"
												style={{ backgroundColor: "#1D809A", color: "#FFFFFF" }}
											>
												<Hand size={20} />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Search and Filter */}
						<div className="mb-8">
							<div className="flex flex-col md:flex-row gap-4">
								<div className="relative flex-1">
									<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
										<Search size={16} className="text-[#8D9192]" />
									</div>
									<input
										type="text"
										placeholder="Search lessons..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D809A] focus:border-transparent bg-[#EDEDED]"
									/>
								</div>
								<div className="flex gap-2">
									<div className="relative">
										<select
											value={levelFilter || ""}
											onChange={(e) =>
												setLevelFilter(e.target.value === "" ? null : e.target.value)
											}
											className="appearance-none pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D809A] focus:border-transparent bg-[#EDEDED]"
										>
											<option value="">All Levels</option>
											<option value="Beginner">Beginner</option>
										</select>
										<div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
											<Filter size={16} className="text-[#8D9192]" />
										</div>
									</div>
									{(searchQuery || levelFilter) && (
										<button
											onClick={resetFilters}
											className="px-4 py-2 border rounded-lg hover:bg-[#EDEDED] transition-colors"
											style={{ backgroundColor: "#EDEDED" }}
										>
											Reset
										</button>
									)}
								</div>
							</div>
						</div>

						{/* Lessons Grid */}
						<div>
							{filteredLessons.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{filteredLessons.map((lesson) => (
										<div
											key={lesson.id}
											className="group border rounded-xl overflow-hidden"
											style={{
												backgroundColor: "#EDEDED",
												boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
											}}
										>
											<div className="p-6">
												<div className="flex justify-between items-start mb-4">
													<div className="flex items-center">
														<div
															className="w-8 h-8 rounded-full flex items-center justify-center"
															style={{ backgroundColor: "#A5D6A7", color: "#FFFFFF" }}
														>
															<GraduationCap size={16} />
														</div>
														<span className="ml-2 text-xs font-medium text-[#8D9192]">
															{lesson.level}
														</span>
													</div>
													{lesson.completed && (
														<div className="bg-[#1D809A]/10 text-[#1D809A] px-2 py-1 text-xs font-medium rounded-full">
															Completed
														</div>
													)}
												</div>
												<h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
												<p className="text-sm text-[#8D9192] mb-4">{lesson.description}</p>
												<div className="flex justify-between items-center">
													<span className="text-sm text-[#8D9192]">{lesson.duration}</span>
													<ChevronRight size={20} className="text-[#1D809A]" />
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-center text-[#8D9192]">No lessons found.</p>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Learn;
