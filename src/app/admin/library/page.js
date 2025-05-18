"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import AdminLayout from "../structure";

const AdminLibrary = () => {
	const [letters, setLetters] = useState([]);
	const [uploadLetter, setUploadLetter] = useState("");
	const [uploadFile, setUploadFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(""); // <-- preview state
	const [loading, setLoading] = useState(false);
	const [showUploadForm, setShowUploadForm] = useState(false);
	const [search, setSearch] = useState("");
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		const fetchLetters = async () => {
			try {
				const colRef = collection(db, "asl_letters_base64");
				const snapshot = await getDocs(colRef);
				setLetters(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
			} catch (error) {
				console.error("Failed to fetch letters:", error);
			}
		};
		fetchLetters();
	}, []);

	useEffect(() => {
		// cleanup preview URL on unmount or file change
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	const fileToBase64 = (file) =>
		new Promise((res, rej) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => res(reader.result);
			reader.onerror = (err) => rej(err);
		});

	const handleUpload = async (e) => {
		e.preventDefault();
		if (!uploadLetter || (!uploadFile && !editing)) {
			alert(editing ? "Letter is required." : "Letter and image file are required.");
			return;
		}
		setLoading(true);
		try {
			let imageBase64;
			if (uploadFile) {
				imageBase64 = await fileToBase64(uploadFile);
			} else {
				imageBase64 = letters.find((l) => l.letter === uploadLetter)?.imageBase64;
			}

			await setDoc(doc(db, "asl_letters_base64", uploadLetter), {
				letter: uploadLetter,
				imageBase64,
				createdAt: new Date(),
			});

			setLetters((prev) => {
				const other = prev.filter((l) => l.letter !== uploadLetter);
				return [...other, { letter: uploadLetter, imageBase64 }];
			});

			setUploadLetter("");
			setUploadFile(null);
			setPreviewUrl("");
			setShowUploadForm(false);
			setEditing(false);
			alert(editing ? "Updated successfully." : "Uploaded successfully.");
		} catch (err) {
			console.error(err);
			alert("Upload failed.");
		}
		setLoading(false);
	};

	const handleDelete = async (letter) => {
		if (!confirm(`Delete ${letter}?`)) return;
		setLoading(true);
		try {
			await deleteDoc(doc(db, "asl_letters_base64", letter));
			setLetters((prev) => prev.filter((l) => l.letter !== letter));
		} catch (err) {
			console.error(err);
			alert("Delete failed.");
		}
		setLoading(false);
	};

	const handleEdit = ({ letter, imageBase64 }) => {
		setUploadLetter(letter);
		setPreviewUrl(imageBase64);
		setUploadFile(null);
		setShowUploadForm(true);
		setEditing(true);
	};

	const filteredLetters = letters.filter((l) => l.letter.toLowerCase().includes(search.toLowerCase()));

	return (
		<div className="min-h-screen bg-[#EDEDED]/30">
			<AdminLayout>
				<div className="bg-white rounded-lg shadow p-6">
					{/* Header */}
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-xl font-semibold text-gray-800">Gesture Library</h2>
						<button
							onClick={() => {
								setShowUploadForm((v) => !v);
								setEditing(false);
								setUploadLetter("");
								setUploadFile(null);
								setPreviewUrl("");
							}}
							className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
						>
							<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
							Add New Gesture
						</button>
					</div>

					{/* Search */}
					<div className="mb-4">
						<div className="relative">
							<input
								type="text"
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
								placeholder="Search gestures..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg
									className="h-5 w-5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* Upload/Edit Form */}
					{showUploadForm && (
						<form onSubmit={handleUpload} className="mb-6 bg-gray-100 p-4 rounded-md">
							<div className="flex flex-col sm:flex-row gap-4 items-center">
								<input
									type="text"
									maxLength={1}
									pattern="[A-Za-z]"
									required
									disabled={editing}
									value={uploadLetter}
									onChange={(e) => setUploadLetter(e.target.value.toUpperCase())}
									placeholder="Letter (A-Z)"
									className="border border-gray-300 rounded p-2 w-full sm:w-24 text-center disabled:opacity-50"
								/>
								<input
									type="file"
									accept="image/png, image/jpeg"
									onChange={(e) => {
										const f = e.target.files[0];
										setUploadFile(f);
										setPreviewUrl(URL.createObjectURL(f));
									}}
									className="w-full sm:w-auto"
								/>
								<button
									type="submit"
									disabled={loading}
									className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
								>
									{loading
										? editing
											? "Updating..."
											: "Uploading..."
										: editing
										? "Update"
										: "Upload"}
								</button>
								<button
									type="button"
									onClick={() => {
										setShowUploadForm(false);
										setEditing(false);
										setUploadLetter("");
										setUploadFile(null);
										setPreviewUrl("");
									}}
									className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
								>
									Cancel
								</button>
							</div>
							{previewUrl && (
								<div className="mt-4">
									<p className="text-sm text-gray-700 mb-2">Preview:</p>
									<img
										src={previewUrl}
										alt="Preview"
										className="h-24 w-24 object-cover rounded-md border"
									/>
								</div>
							)}
							{editing && (
								<p className="mt-2 text-sm text-gray-600">Leave file empty to keep current image.</p>
							)}
						</form>
					)}

					{/* Table */}
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Gesture
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Name
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredLetters.length === 0 ? (
									<tr>
										<td colSpan={3} className="text-center py-6 text-gray-500">
											No gestures found.
										</td>
									</tr>
								) : (
									filteredLetters.map(({ letter, imageBase64 }) => (
										<tr key={letter}>
											<td className="px-6 py-4 whitespace-nowrap">
												<img
													src={imageBase64}
													alt={letter}
													className="h-24 w-24 rounded-md object-cover"
												/>
											</td>
											<td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
												{letter}
											</td>
											<td className="px-6 py-4 whitespace-nowrap space-x-2">
												<button
													onClick={() => handleEdit({ letter, imageBase64 })}
													disabled={loading}
													className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:opacity-50"
												>
													Edit
												</button>
												<button
													onClick={() => handleDelete(letter)}
													disabled={loading}
													className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
												>
													Delete
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</AdminLayout>
		</div>
	);
};

export default AdminLibrary;
