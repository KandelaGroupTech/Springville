import { createClient } from '@supabase/supabase-js';

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

        // Initialize Supabase client
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Prepare guest data
        const guestData = {
            full_name: fullName.trim(),
            first_name: firstName,
            check_in: checkIn,
            check_out: checkOut,
            concierge_note: conciergeNote || ''
        };

        // Insert new guest (no longer upsert - allow multiple guests)
        const { data, error } = await supabase
            .from('guest_data')
            .insert(guestData)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: 'Guest data added successfully',
            data: {
                fullName: data.full_name,
                firstName: data.first_name,
                checkIn: data.check_in,
                checkOut: data.check_out,
                conciergeNote: data.concierge_note
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
