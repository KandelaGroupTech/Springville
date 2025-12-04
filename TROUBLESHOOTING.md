# Vercel Serverless Functions - Troubleshooting

## Issue
API endpoints returning 404 errors on Vercel deployment.

## Root Cause
Vercel's serverless functions have a read-only filesystem. We cannot use `fs.writeFileSync()` to update `data/guest.json`.

## Solutions

### Option 1: Use Vercel KV (Recommended for Production)
- Requires Vercel KV setup
- Persistent storage
- Costs apply after free tier

### Option 2: Client-Side Storage (Quick Fix)
- Use localStorage in browser
- No server-side persistence
- Data lost if browser cache cleared
- Good for testing/demo

### Option 3: External Database
- Use MongoDB, Supabase, or similar
- Requires additional setup
- Most robust solution

## Current Status
Implementing Option 2 (client-side) as quickest solution for testing.
