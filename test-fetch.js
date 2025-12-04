import { db } from './lib/firebase.js';
import { doc, getDoc } from 'firebase/firestore';

async function test() {
    try {
        console.log("Testing fetch...");
        const docRef = doc(db, "guests", "default");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Fetched data:", docSnap.data());
        } else {
            console.log("No such document!");
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
test();
