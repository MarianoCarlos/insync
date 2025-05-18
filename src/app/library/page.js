"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Image from "next/image";
import { db } from "@/utils/firebase"; // ensure this path is correct
import { collection, getDocs } from "firebase/firestore";

const Letters = () => {
	const [aslLetters, setAslLetters] = useState([]);

	useEffect(() => {
		const fetchLetters = async () => {
			try {
				const colRef = collection(db, "asl_letters_base64");
				const snapshot = await getDocs(colRef);
				const fetchedLetters = snapshot.docs
					.map((doc) => doc.data())
					.sort((a, b) => a.letter.localeCompare(b.letter)); // Sort A-Z

				setAslLetters(fetchedLetters);
			} catch (error) {
				console.error("Error fetching letters:", error);
			}
		};

		fetchLetters();
	}, []);

	return (
		<div className="min-h-screen flex flex-col" style={{ backgroundColor: "#EDEDED", color: "#252525" }}>
			<Navbar />

			<main className="flex-1 pt-32 pb-20">
				<div className="container mx-auto px-4 md:px-6">
					<div className="max-w-5xl mx-auto text-center mb-12">
						<div
							className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full"
							style={{ backgroundColor: "rgba(29, 128, 154, 0.1)", color: "#1D809A" }}
						>
							ASL Alphabet
						</div>
						<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
							Explore the ASL Letters A-Z
						</h1>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
						{aslLetters.map(({ letter, imageBase64 }) => (
							<div key={letter} className="bg-white rounded-xl shadow hover:shadow-md transition border">
								<div className="relative w-full aspect-square">
									<Image
										src={imageBase64}
										alt={`ASL for ${letter}`}
										fill
										className="rounded-t-xl object-cover"
									/>
								</div>
								<div className="p-3 text-center">
									<h3 className="text-lg font-semibold" style={{ color: "#1D809A" }}>
										Letter {letter}
									</h3>
								</div>
							</div>
						))}
					</div>
				</div>
			</main>

			<footer className="text-center py-6 text-gray-600">
				<p>&copy; 2025 ASL Web App. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default Letters;
