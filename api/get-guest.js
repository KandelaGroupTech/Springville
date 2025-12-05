import { db } from '../lib/firebase.js';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get current date
    const today = new Date().toISOString().split('T')[0];

    console.log('Looking for guest on date:', today);

    // Get current guest: check_in <= today AND check_out >= today
    // Note: Firestore requires an index for compound queries with range filters on different fields.
    // If this fails, we might need to query by one field and filter in memory, or create the index.
    // For now, let's try a simpler query or just fetch active guests.
    
    const guestsRef = collection(db, "guests");
    const q = query(
      guestsRef,
      where("check_in", "<=", today),
      where("check_out", ">=", today),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    // If no current guest, return default
    if (querySnapshot.empty) {
      console.log('No current guest found, returning default');
      return res.status(200).json({
        fullName: "Guest Name",
        firstName: "Guest",
        checkIn: today,
        checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        conciergeNote: "Welcome to Casa Springville! We hope you enjoy your stay."
      });
    }

    // Get the first result
    const guestDoc = querySnapshot.docs[0];
    const guest = guestDoc.data();

    console.log('Returning guest:', guest.full_name);

    return res.status(200).json({
      fullName: guest.full_name,
      firstName: guest.first_name,
      checkIn: guest.check_in,
      checkOut: guest.check_out,
      conciergeNote: guest.concierge_note
    });
  } catch (error) {
    console.error('Error reading guest data:', error);
    return res.status(500).json({
      error: 'Failed to load guest data',
      details: error.message
    });
  }
}
