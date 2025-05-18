"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { MessageCircle, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import AdminLayout from "../structure";

export default function FeedbackAdminPage() {
	const [feedbacks, setFeedbacks] = useState([]);
	const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
	const [selectedRating, setSelectedRating] = useState("all");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [averageRating, setAverageRating] = useState(0);

	useEffect(() => {
		const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const feedbackList = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setFeedbacks(feedbackList);
				setLoading(false);
			},
			(err) => {
				console.error("Error fetching feedbacks:", err);
				setError("Failed to load feedbacks");
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (selectedRating === "all") {
			setFilteredFeedbacks(feedbacks);
		} else {
			const ratingValue = parseInt(selectedRating);
			setFilteredFeedbacks(feedbacks.filter((fb) => fb.rating === ratingValue));
		}
	}, [selectedRating, feedbacks]);

	useEffect(() => {
		if (filteredFeedbacks.length === 0) {
			setAverageRating(0);
			return;
		}
		const total = filteredFeedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0);
		const avg = total / filteredFeedbacks.length;
		setAverageRating(avg);
	}, [filteredFeedbacks]);

	const ratingCounts = [1, 2, 3, 4, 5].map((star) => ({
		rating: star,
		count: feedbacks.filter((fb) => fb.rating === star).length,
	}));

	if (loading)
		return (
			<div className="p-6 text-[#1D809A] text-center text-lg font-semibold animate-fade-in">
				Loading feedbacks...
			</div>
		);
	if (error) return <div className="p-6 text-red-600 text-center text-lg font-semibold animate-fade-in">{error}</div>;

	return (
		<div className="min-h-screen bg-[#EDEDED] bg-opacity-30 p-8">
			<AdminLayout>
				<div className="max-w-6xl mx-auto">
					{/* Header and filter */}
					<div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
						<h1 className="text-3xl font-extrabold text-[#1D809A] flex items-center gap-3">
							<MessageCircle size={28} />
							User Feedback
						</h1>

						<select
							value={selectedRating}
							onChange={(e) => setSelectedRating(e.target.value)}
							className="border border-[#1D809A] rounded-full px-4 py-2 text-sm font-semibold
                       focus:outline-none focus:ring-2 focus:ring-[#1D809A] cursor-pointer
                       transition-colors duration-200"
							aria-label="Filter feedback by rating"
						>
							<option value="all">All Ratings</option>
							<option value="5">5 Stars</option>
							<option value="4">4 Stars</option>
							<option value="3">3 Stars</option>
							<option value="2">2 Stars</option>
							<option value="1">1 Star</option>
						</select>
					</div>

					{/* Average rating */}
					<div className="mb-10 flex items-center gap-3 text-[#1D809A] font-semibold text-xl">
						<Star className="w-7 h-7 text-yellow-400" />
						<span>
							Average Rating: <span className="text-black">{averageRating.toFixed(1)}</span> / 5 (
							{filteredFeedbacks.length} {filteredFeedbacks.length === 1 ? "feedback" : "feedbacks"})
						</span>
					</div>

					{/* Bar chart card */}
					<div className="bg-white rounded-lg border border-gray-300 shadow-md p-6 mb-12 hover:shadow-lg transition-shadow">
						<h2 className="text-lg font-semibold mb-4 text-[#1D809A]">Feedback Counts by Rating</h2>
						<div className="w-full h-52">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={ratingCounts} margin={{ top: 15, right: 25, left: 0, bottom: 10 }}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="rating"
										tickFormatter={(val) => `${val}★`}
										tickLine={false}
										axisLine={{ stroke: "#1D809A" }}
										style={{ fontWeight: "600" }}
									/>
									<YAxis allowDecimals={false} />
									<Tooltip
										formatter={(value) => [value, "Count"]}
										cursor={{ fill: "rgba(29,128,154,0.1)" }}
									/>
									<Bar dataKey="count" fill="#1D809A" radius={[5, 5, 0, 0]} barSize={40} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Feedback list */}
					{filteredFeedbacks.length === 0 ? (
						<p className="text-center text-gray-500 text-lg animate-fade-in">
							No feedback matches the selected rating.
						</p>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
							{filteredFeedbacks.map((fb) => (
								<div
									key={fb.id}
									className="bg-white p-6 rounded-lg border border-gray-300 shadow-md
                           hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
								>
									<div>
										<p className="text-sm font-medium text-[#1D809A] truncate max-w-full mb-1">
											{fb.userEmail || "Anonymous"}
										</p>
										<div className="flex items-center gap-1 mb-3">
											{[...Array(5)].map((_, i) => {
												const starIndex = i + 1;
												return (
													<Star
														key={i}
														size={16}
														className={
															starIndex <= fb.rating ? "text-yellow-400" : "text-gray-300"
														}
													/>
												);
											})}
										</div>
										<p className="text-sm text-gray-600 whitespace-pre-wrap break-words">
											{fb?.feedback || "No comment provided."}
										</p>
									</div>
									<p className="mt-4 text-xs text-gray-400 text-right">
										{fb.createdAt ? new Date(fb.createdAt.seconds * 1000).toLocaleDateString() : ""}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</AdminLayout>
		</div>
	);
}
