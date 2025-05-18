// pages/api/deleteUser.js (or /api/deleteUser.ts)

import admin from "firebase-admin";

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
		}),
		databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
	});
}

const db = admin.firestore();

export default async function handler(req, res) {
	if (req.method !== "DELETE") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { userID } = req.body;
	if (!userID) {
		return res.status(400).json({ error: "Missing userID" });
	}

	try {
		// Get user document to retrieve uid
		const userDoc = await db.collection("users").doc(userID).get();
		if (!userDoc.exists) {
			return res.status(404).json({ error: "User not found" });
		}
		const { uid } = userDoc.data();

		// Delete Firebase Auth user by UID
		await admin.auth().deleteUser(uid);

		// Delete Firestore user document
		await db.collection("users").doc(userID).delete();

		return res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}
