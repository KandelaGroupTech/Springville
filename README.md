# HomePortal - Casa Springville

A modern, elegant landing portal for The Kandela Group's Casa Springville property, featuring a guest welcome dashboard.

## 🏗️ Project Structure

```
HomePortal/
├── index.html              # Main landing page
├── welcome/                # Guest Welcome Dashboard (Built React App)
│   ├── index.html         # Dashboard entry point
│   └── assets/            # Compiled React application assets
│       ├── index-CCRkGudC.js
│       └── index-BOs0pUsY.css
├── vercel.json            # Vercel deployment configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🎨 Features

### Landing Page (`index.html`)
- **Elegant Design**: Dark theme with gold accents and glassmorphism effects
- **Typography**: Premium fonts (Playfair Display serif + Inter sans-serif)
- **Responsive**: Mobile-first design with Tailwind CSS
- **Navigation**: Clean card-based navigation to guest dashboard
- **Branding**: Casa Springville branding with The Kandela Group identity

### Guest Welcome Dashboard (`/welcome/`)
- **React Application**: Modern SPA built with React 19
- **ESM Imports**: Uses import maps for CDN-based dependencies
- **Dependencies**:
  - React 19.2.0
  - Google Generative AI
  - Lucide React (icons)
  - React QR Code
- **Kiosk-Friendly**: Hidden scrollbars for clean presentation

## 🚀 Running the Project

### Option 1: Static File Server (Recommended)

Since this is a static site with a built React application, you can serve it using any static file server:

#### Using Python:
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

#### Using Node.js (http-server):
```bash
# Install globally (one time)
npm install -g http-server

# Run from project directory
http-server -p 8000

# Then visit: http://localhost:8000
```

#### Using PHP:
```bash
php -S localhost:8000

# Then visit: http://localhost:8000
```

### Option 2: Live Server (VS Code)

1. Install the "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## 🌐 Deployment

**Live Site**: [https://home.thekandelagroup.com](https://home.thekandelagroup.com)

This project is deployed on **Vercel** with automatic deployments from GitHub.

### Vercel Deployment (Current)

The site is configured for automatic deployment:
- **Repository**: `KandelaGroupTech/HomePortal`
- **Branch**: `main`
- **Custom Domain**: `home.thekandelagroup.com`
- **Auto-Deploy**: Every push to `main` triggers a new deployment

**Configuration Files:**
- `vercel.json` - Routing and caching configuration
- `.gitignore` - Excludes build artifacts

### Manual Deployment Steps

If deploying to a new Vercel project:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import `KandelaGroupTech/HomePortal`
   - Framework: Other (static site)
   - Click "Deploy"

3. **Configure Custom Domain**:
   - Project Settings → Domains
   - Add: `home.thekandelagroup.com`
   - Configure DNS:
     ```
     Type:  CNAME
     Name:  home
     Value: cname.vercel-dns.com
     ```

### Alternative Hosting Options
- **Netlify**: Drag & drop deployment
- **GitHub Pages**: Free hosting for static sites
- **AWS S3 + CloudFront**: Enterprise-grade hosting
- **Traditional Web Hosting**: Any Apache/Nginx server

## 🔐 Guest Management System

### Admin Access

Access the admin panel to update guest information:
- **URL**: `https://home.thekandelagroup.com/admin`
- **Default Password**: `casaspringville2024` (change in Vercel environment variables)

### Admin Features

**Update Guest Information:**
- Guest full name (first name displayed on dashboard)
- Check-in and check-out dates
- Concierge welcome note

### API Endpoints

- **GET** `/api/get-guest` - Retrieve current guest data
- **POST** `/api/update-guest` - Update guest information (requires password)

### Configuration

**Set Admin Password in Vercel:**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add variable:
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: Your secure password
4. Redeploy the project

**Data Storage:**
- Guest data stored in `/data/guest.json`
- Automatically updated via admin panel
- Dashboard reads data on page load

## 🎯 Navigation Flow

1. User lands on **main portal** (`index.html`)
2. Clicks "Welcome Dashboard" card
3. Navigates to **guest dashboard** (`/welcome/`)
4. Dashboard loads React application with full features

## 🔧 Technology Stack

### Landing Page
- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first styling (CDN)
- **Custom CSS**: Dark theme and animations
- **Google Fonts**: Playfair Display & Inter

### Welcome Dashboard
- **React 19**: Latest React with concurrent features
- **ESM Imports**: Modern JavaScript modules via CDN
- **Tailwind CSS**: Consistent styling
- **Google Generative AI**: AI-powered features
- **Lucide React**: Modern icon library
- **React QR Code**: QR code generation

## 📝 Customization

### Updating Branding
Edit the following in `index.html`:
- Line 51: Property name ("Casa Springville")
- Line 55: Company name ("The Kandela Group")
- Lines 20-23: Brand colors (casa-gold, casa-dark)

### Adding New Portal Links
Add new navigation cards in the `<nav>` section (lines 60-96) following the existing pattern.

## 🔐 Git Repository

This project is already initialized with Git (`.git` directory present).

### Common Git Commands:
```bash
# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Your message"

# Push to remote
git push origin main
```

## 📄 License

© 2024 The Kandela Group. All rights reserved.

## 🆘 Support

For issues or questions about this portal, contact The Kandela Group development team.

---

**Last Updated**: November 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
