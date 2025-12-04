import { db } from './lib/firebase.js';
import { doc, setDoc } from "firebase/firestore";

const guestData = {
    firstName: "Ramona",
    lastName: "Williams",
    checkIn: "2025-12-04",
    checkOut: "2025-12-07",
    conciergeNote: "Welcome back, Ramona! We've prepared your favorite room overlooking the garden. The weather is perfect for an evening stroll."
};

async function seed() {
    try {
        console.log("Seeding guest data...");
        await setDoc(doc(db, "guests", "default"), guestData);
        console.log("Guest data seeded successfully!");
        process.exit(0);
    } catch (e) {
        console.error("Error seeding data: ", e);
        process.exit(1);
    }
}

seed();
