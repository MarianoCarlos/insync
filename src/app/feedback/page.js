"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/navbar";

export default function FeedbackPage() {
	const [rating, setRating] = useState(0);
	const [feedback, setFeedback] = useState("");
	const [status, setStatus] = useState(null);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				setUser(currentUser);
			} else {
				setUser(null);
			}
		});
		return () => unsubscribe();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (rating === 0) {
			alert("Please select a rating.");
			return;
		}

		if (!user) {
			alert("You must be logged in to submit feedback.");
			return;
		}

		setStatus("loading");

		try {
			await addDoc(collection(db, "feedbacks"), {
				rating,
				feedback,
				userId: user.uid,
				userEmail: user.email,
				createdAt: serverTimestamp(),
			});
			setStatus("success");
			setRating(0);
			setFeedback("");
		} catch (err) {
			console.error("Error saving feedback:", err);
			setStatus("error");
		}
	};

	return (
		<div className="min-h-screen bg-[#EDEDED] bg-opacity-30 flex flex-col">
			<Navbar />
			<main className="flex flex-col items-center justify-center flex-1 p-8 text-center">
				<div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 mt-12 border border-gray-300">
					<h1 className="text-3xl font-bold mb-6 text-[#1D809A]">We value your feedback</h1>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="text-left">
							<label className="block text-sm font-semibold text-[#374151] mb-2">
								Rate your experience:
							</label>
							<div className="flex gap-2">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star key={star} filled={star <= rating} onClick={() => setRating(star)} />
								))}
							</div>
						</div>

						<div className="text-left">
							<label htmlFor="feedback" className="block text-sm font-semibold text-[#374151] mb-2">
								Your feedback:
							</label>
							<textarea
								id="feedback"
								rows={4}
								value={feedback}
								onChange={(e) => setFeedback(e.target.value)}
								className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#1D809A]"
								placeholder="Let us know how we can improve..."
							/>
						</div>

						<button
							type="submit"
							className="w-full bg-[#1D809A] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#166a7d] transition-colors shadow-md"
							disabled={status === "loading"}
						>
							{status === "loading" ? "Submitting..." : "Submit Feedback"}
						</button>

						{status === "success" && (
							<p className="text-green-600 font-medium text-center">Thank you for your feedback!</p>
						)}
						{status === "error" && (
							<p className="text-red-600 font-medium text-center">
								Something went wrong. Please try again.
							</p>
						)}
					</form>
				</div>
			</main>

			<footer className="text-center py-6 text-[#252525]">
				<p>&copy; 2025 ASL Web App. All rights reserved.</p>
			</footer>
		</div>
	);
}

function Star({ filled, onClick }) {
	return (
		<svg
			onClick={onClick}
			xmlns="http://www.w3.org/2000/svg"
			className={`h-8 w-8 cursor-pointer transition-colors ${filled ? "text-yellow-400" : "text-gray-300"}`}
			fill={filled ? "currentColor" : "none"}
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.146 6.58a1 1 0 00.95.69h6.91c.969 0 1.371 1.24.588 1.81l-5.593 4.04a1 1 0 00-.364 1.118l2.146 6.58c.3.921-.755 1.688-1.54 1.118l-5.593-4.04a1 1 0 00-1.176 0l-5.593 4.04c-.784.57-1.838-.197-1.54-1.118l2.146-6.58a1 1 0 00-.364-1.118L2.355 11.007c-.783-.57-.38-1.81.588-1.81h6.91a1 1 0 00.95-.69l2.146-6.58z"
			/>
		</svg>
	);
}
