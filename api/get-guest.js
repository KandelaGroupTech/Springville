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
    // We query by check_out >= today to find active/future guests, then filter in memory
    // to avoid needing a composite index for this simple app.

    const guestsRef = collection(db, "guests");
    const q = query(
      guestsRef,
      where("check_out", ">=", today),
      orderBy("check_out", "asc") // Optional, but good for consistency
    );

    const querySnapshot = await getDocs(q);

    // Filter in memory for check_in <= today
    const activeGuests = querySnapshot.docs
      .map(doc => doc.data())
      .filter(guest => guest.check_in <= today);

    // If no current guest, return default
    if (activeGuests.length === 0) {
      console.log('No current guest found, returning default');
      return res.status(200).json({
        fullName: "Guest Name",
        firstName: "Guest",
        checkIn: today,
        checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        conciergeNote: "Welcome to Casa Springville! We hope you enjoy your stay."
      });
    }

    // Sort in memory by created_at descending to get the latest update
    activeGuests.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });

    // Get the first result (most recently created)
    const guest = activeGuests[0];

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
