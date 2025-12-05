import { db } from '../lib/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { password, fullName, checkIn, checkOut, conciergeNote } = req.body;

        // Validate password
        const adminPassword = process.env.ADMIN_PASSWORD || 'casaspringville2024';
        if (password !== adminPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Validate required fields
        if (!fullName || !checkIn || !checkOut) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkOutDate < today) {
            return res.status(400).json({ error: 'Check-out date cannot be in the past' });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ error: 'Check-out date must be after check-in date' });
        }

        // Extract first name
        const firstName = fullName.trim().split(' ')[0];

        // Prepare guest data
        const guestData = {
            full_name: fullName.trim(),
            first_name: firstName,
            check_in: checkIn,
            check_out: checkOut,
            concierge_note: conciergeNote || '',
            created_at: new Date().toISOString()
        };

        // Insert new guest into Firestore
        const docRef = await addDoc(collection(db, "guests"), guestData);

        return res.status(200).json({
            success: true,
            message: 'Guest data added successfully',
            data: {
                id: docRef.id,
                fullName: guestData.full_name,
                firstName: guestData.first_name,
                checkIn: guestData.check_in,
                checkOut: guestData.check_out,
                conciergeNote: guestData.concierge_note
            }
        });
    } catch (error) {
        console.error('Error updating guest data:', error);
        return res.status(500).json({
            error: 'Failed to update guest data',
            details: error.message
        });
    }
}
