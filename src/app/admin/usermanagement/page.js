"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc, onSnapshot, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { db, auth, secondaryAuth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import AdminLayout from "../structure";

const usersCollection = collection(db, "users");

export default function AdminPage() {
	const router = useRouter();
	const [users, setUsers] = useState([]);
	const [authChecked, setAuthChecked] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		age: "",
		dob: "",
		disability: "",
	});
	const [editId, setEditId] = useState(null);
	const [loading, setLoading] = useState(false);

	// Protect route
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) router.push("/");
			else setAuthChecked(true);
		});
		return () => unsubscribe();
	}, []);

	// Real-time users listener
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

	const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

	const resetForm = () => {
		setForm({
			name: "",
			email: "",
			password: "",
			age: "",
			dob: "",
			disability: "",
		});
		setEditId(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			if (editId) {
				const userRef = doc(db, "users", editId);
				await updateDoc(userRef, {
					name: form.name,
					age: form.age,
					dob: form.dob,
					disability: form.disability,
				});
				alert("User updated.");
			} else {
				if (!form.password) {
					alert("Password is required.");
					setLoading(false);
					return;
				}
				const userCredential = await createUserWithEmailAndPassword(secondaryAuth, form.email, form.password);
				await setDoc(doc(db, "users", userCredential.user.uid), {
					name: form.name,
					email: form.email,
					uid: userCredential.user.uid,
					age: form.age,
					dob: form.dob,
					isAdmin: false,
					disability: form.disability,
				});
				alert("User created.");
			}
			resetForm();
			setShowModal(false);
		} catch (err) {
			console.error("Error saving user:", err);
			alert("Error: " + err.message);
		}
		setLoading(false);
	};

	const handleEdit = (user) => {
		setEditId(user.id);
		setForm({
			name: user.name,
			email: user.email,
			password: "",
			age: user.age || "",
			dob: user.dob || "",
			disability: user.disability || "",
		});
		setShowModal(true);
	};

	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this user?")) return;

		try {
			const res = await fetch("/api/deleteUser", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userID: id }),
			});
			const data = await res.json();

			if (res.ok) alert(data.message);
			else alert(data.error);
		} catch (err) {
			console.error("Error deleting user:", err);
			alert("Failed to delete user.");
		}
	};

	return (
		<div className="min-h-screen bg-[#EDEDED]/30">
			<AdminLayout>
				<h1 className="text-4xl font-bold text-center text-[#1D809A] mb-8">Admin Dashboard</h1>

				<div className="max-w-6xl mx-auto mb-6 flex justify-end">
					<button
						className="bg-[#1D809A] hover:bg-[#166a7d] text-white px-4 py-2 rounded"
						onClick={() => {
							resetForm();
							setShowModal(true);
						}}
					>
						+ Create New User
					</button>
				</div>

				{/* Modal */}
				{showModal && (
					<div className="flex items-center justify-center mb-8">
						<div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
							<h2 className="text-xl font-semibold mb-4">{editId ? "Edit User" : "Create User"}</h2>
							<form onSubmit={handleSubmit}>
								<input
									type="text"
									name="name"
									value={form.name}
									onChange={handleChange}
									placeholder="Full Name"
									required
									className="w-full mb-3 p-2 border rounded"
								/>
								<input
									type="email"
									name="email"
									value={form.email}
									onChange={handleChange}
									placeholder="Email"
									required
									className="w-full mb-3 p-2 border rounded"
									disabled={!!editId}
								/>
								<input
									type="password"
									name="password"
									value={form.password}
									onChange={handleChange}
									placeholder={editId ? "New Password (optional)" : "Password"}
									className="w-full mb-3 p-2 border rounded"
									required={!editId}
								/>
								<input
									type="number"
									name="age"
									value={form.age}
									onChange={handleChange}
									placeholder="Age"
									className="w-full mb-3 p-2 border rounded"
									min="0"
								/>
								<input
									type="date"
									name="dob"
									value={form.dob}
									onChange={handleChange}
									className="w-full mb-3 p-2 border rounded"
								/>
								<input
									type="text"
									name="disability"
									value={form.disability}
									onChange={handleChange}
									placeholder="Disability"
									className="w-full mb-4 p-2 border rounded"
								/>
								<div className="flex justify-end space-x-2">
									<button
										type="button"
										onClick={() => {
											resetForm();
											setShowModal(false);
										}}
										className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={loading}
										className={`px-4 py-2 rounded text-white ${
											loading ? "bg-gray-400" : "bg-[#1D809A] hover:bg-[#166a7d]"
										}`}
									>
										{loading
											? editId
												? "Updating..."
												: "Creating..."
											: editId
											? "Update"
											: "Create"}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* User Table */}
				<div className="overflow-x-auto max-w-6xl mx-auto">
					<table className="w-full bg-white border rounded shadow-md text-left">
						<thead className="bg-[#1D809A] text-white">
							<tr>
								<th className="py-3 px-4">Name</th>
								<th className="py-3 px-4">Email</th>
								<th className="py-3 px-4">Age</th>
								<th className="py-3 px-4">DOB</th>
								<th className="py-3 px-4">Disability</th>
								<th className="py-3 px-4">Actions</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.id} className="border-t">
									<td className="py-3 px-4">{user.name}</td>
									<td className="py-3 px-4">{user.email}</td>
									<td className="py-3 px-4">{user.age || "-"}</td>
									<td className="py-3 px-4">{user.dob || "-"}</td>
									<td className="py-3 px-4">{user.disability || "-"}</td>
									<td className="py-3 px-4 space-x-2">
										<button
											onClick={() => handleEdit(user)}
											className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(user.id)}
											className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
							{users.length === 0 && (
								<tr>
									<td colSpan="6" className="text-center py-4 text-gray-500">
										No users found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</AdminLayout>
		</div>
	);
}
