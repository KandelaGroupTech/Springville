import { createClient } from '@supabase/supabase-js';

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
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Get current date
    const today = new Date().toISOString().split('T')[0];

    console.log('Looking for guest on date:', today);

    // Get current guest: check_in <= today AND check_out >= today
    const { data, error } = await supabase
      .from('guest_data')
      .select('*')
      .lte('check_in', today)
      .gte('check_out', today)
      .order('check_in', { ascending: false })
      .order('id', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    console.log('Query result:', data);

    // If no current guest, return default
    if (!data || data.length === 0) {
      console.log('No current guest found, returning default');
      return res.status(200).json({
        fullName: "Guest Name",
        firstName: "Guest",
        checkIn: today,
        checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        conciergeNote: "Welcome to Casa Springville! We hope you enjoy your stay."
      });
    }

    // Get the first result (most recent check-in)
    const guest = Array.isArray(data) ? data[0] : data;

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
