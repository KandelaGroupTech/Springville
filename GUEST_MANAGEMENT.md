# Guest Management System - Usage Guide

## Quick Start

### Accessing the Admin Panel

1. Navigate to: `https://home.thekandelagroup.com/admin`
2. Enter the admin password (default: `casaspringville2024`)
3. Update guest information
4. Click "Update Guest Information"

## Updating Guest Information

### Guest Name
- Enter the **full name** of the guest
- Only the **first name** will be displayed on the dashboard
- Example: "John Smith" → Dashboard shows "John"

### Stay Dates
- **Check-in Date**: Guest arrival date
- **Check-out Date**: Guest departure date
- System validates that check-out is after check-in

### Concierge Note
- Welcome message or special instructions
- Displayed prominently on the guest dashboard
- Can include room information, amenities, or personalized greetings

## How It Works

### Data Flow

```
Admin Panel → API Endpoint → guest.json → Guest Dashboard
```

1. **Admin updates** guest info via `/admin`
2. **API validates** password and data
3. **Data saved** to `/data/guest.json`
4. **Dashboard loads** data from `/api/get-guest`
5. **Guest sees** updated information

### Security

- **Password Protected**: Admin panel requires password
- **Environment Variable**: Password stored securely in Vercel
- **API Validation**: All updates validated server-side

## Changing the Admin Password

### In Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (HomePortal)
3. Navigate to **Settings** → **Environment Variables**
4. Find `ADMIN_PASSWORD` or add new variable:
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: Your new secure password
5. Click **Save**
6. **Redeploy** the project (Deployments → Latest → Redeploy)

### Testing the Change

1. Go to `/admin`
2. Try the new password
3. Update guest information to confirm it works

## Troubleshooting

### "Invalid password" error
- Check that you're using the correct password
- Verify password in Vercel environment variables
- Ensure project was redeployed after password change

### Guest data not updating on dashboard
- Clear browser cache
- Check browser console for errors
- Verify `/api/get-guest` returns correct data

### Admin panel not loading
- Check that `/admin/index.html` exists
- Verify Vercel deployment succeeded
- Check browser console for errors

## Best Practices

### Before Guest Arrival
1. Update guest name 1-2 days before check-in
2. Set correct check-in/check-out dates
3. Personalize concierge note with:
   - Room number
   - WiFi password
   - Special amenities
   - Local recommendations

### Example Concierge Notes

**Standard Welcome:**
```
Welcome to Casa Springville! Your room is ready on the second floor. 
WiFi password: CasaGuest2024. Enjoy your stay!
```

**VIP Guest:**
```
Welcome back! We've prepared your favorite room with fresh flowers. 
Complimentary breakfast is served 7-10 AM. Let us know if you need anything!
```

**Extended Stay:**
```
Welcome to your home away from home! Weekly housekeeping is included. 
The kitchen is fully stocked. Enjoy your month with us!
```

## API Reference

### GET /api/get-guest

Retrieve current guest data.

**Response:**
```json
{
  "fullName": "John Smith",
  "firstName": "John",
  "checkIn": "2024-12-01",
  "checkOut": "2024-12-07",
  "conciergeNote": "Welcome message..."
}
```

### POST /api/update-guest

Update guest information (requires password).

**Request:**
```json
{
  "password": "your-admin-password",
  "fullName": "Jane Doe",
  "checkIn": "2024-12-10",
  "checkOut": "2024-12-15",
  "conciergeNote": "Welcome! Your room is ready."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Guest data updated successfully",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "error": "Invalid password"
}
```

## Support

For issues or questions:
- Check the troubleshooting section above
- Review browser console for errors
- Verify Vercel deployment logs
- Contact The Kandela Group development team
