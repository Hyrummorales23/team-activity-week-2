430 Team Project for Week 2 - Team 1

Artisan Marketplace - Handcrafted Goods Platform

## Team Members

- Hyrum Morales
- Samuel Riveros
- Lifegate Justice
- Boitumelo Meletse
- Uchechukwu Promise
- Happiness Ncube
- Julius Songopa
- Oswell Okine

## Project Overview

An online marketplace connecting talented artisans with customers seeking unique, handcrafted items. Features product listings, artisan profiles, ratings/reviews, and secure authentication.

## 🚀 Live Application

[![Vercel Deployment](https://img.shields.io/badge/Live%20on-Vercel-black?logo=vercel)](https://handcrafted-heaven.vercel.app/)

## Tech Stack

- Framework: Next.js 16.0.1 (App Router)
- Language: TypeScript 5
- Styling: CSS Modules
- Font: Roboto (Google Fonts)
- Linting: ESLint 9 with Next.js config
- Package Manager: npm
- Database (planned): MongoDB

## Design System

# Color Palette

- Primary: Warm Terracota (#C26D3D)
- Hover: Earthy Green (#5A7052)
- Background: Light Gray (#F0F2F5)
- Surface: White (#FFFFFF)
- Text Primary: Dark Gray (#1C1E21)
- Text Secondary: Medium Gray (#65676B)
- Borders: Light Gray (#CED0D4)

# Typography

- Body: Roboto
- Headings: System Sans-Serif

## Project Structure

team-activity-week-2/
├── src/
│ ├── app/
│ │ ├── page.tsx (Home page)
│ │ ├── home.module.css
│ │ ├── catalog/ (Product catalog)
│ │ ├── login/ (Authentication)
│ │ ├── register/
│ │ ├── artisans/ (Artisan listings)
│ │ ├── profile/ (User profile)
│ │ ├── layout.tsx (Root layout)
│ │ └── globals.css (Design system)
│ └── components/
│ ├── Header/ (Main navigation)
│ ├── Sidebar/ (Category navigation)
│ └── Layout/ (Page layouts)
├── public/ (Static assets)
├── NAVIGATION_DOCS.md (Navigation documentation)
├── TEAM_GUIDE.md (Collaboration guidelines)
└── PROJECT_STATUS.md (Setup status)

## Features Implemented

# Navigation System

Sticky header with logo and navigation links
Left sidebar with product categories
Responsive mobile design
Consistent styling across pages

# Pages Created

Home (/) - Hero section, featured categories, product sections
Catalog (/catalog) - Product grid with sidebar and filters
Login (/login) - User authentication form
Register (/register) - Account creation
Artisans (/artisans) - Featured artisan profiles
Profile (/profile) - User account management

# Components

Header: Global navigation bar
Sidebar: Category and filter navigation
MainLayout: Flexible page layout wrapper

## Getting Started

- Install Dependencies
- npm install
- Run Development Server
- npm run dev
- npm run dev
- Open http://localhost:3000 to view the application.

# Available Routes

/ - Home page
/catalog - Browse products
/catalog?category=ceramics - Filtered by category
/login - User login
/register - Create account
/artisans - View artisan profiles
/profile - User profile (placeholder)

Work Items (From Project Planning)

Priority Features

1. Boilerplate & Routing - Complete
2. Authentication - Login/Register UI ready, backend needed
3. Artisan Profile - UI created, needs data integration
4. Product Catalog - Layout ready, needs product data
5. Search/Filtering - UI ready, needs implementation
6. Rating System - Not started
7. Database Setup - Not started
8. API Endpoints - Not started
9. Route Protection - Not started

# Data Schemas (Planned)

Product Schema
id: string
name: string
description: string
price: number
imageUrl: string
category: string
userId: string (Artisan ID)

User Schema
id: string
type: 'customer' or 'artisan'
name: string
email: string
hashedPassword: string

Review Schema
id: string
productId: string
userId: string
rating: number (1-5)
description: string

# Development Workflow

For Team Members

1. Pull latest changes
   git pull origin main

2. Create feature branch
   git checkout -b feature/your-feature-name

3. Make changes and test
   npm run dev
   npm run lint

4. Commit and push
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature-name

5. Create Pull Request for team review

Next Steps

Immediate Tasks
Set up MongoDB database
Create API routes for authentication
Implement product CRUD operations
Add image upload functionality
Build rating/review system
Implement search functionality
Add route protection middleware
Deploy to production

Component Assignments (Suggested)
See TEAM_GUIDE.md for detailed task breakdown and assignments.

Documentation

README.md (this file) - Project overview
NAVIGATION_DOCS.md - Navigation system documentation
TEAM_GUIDE.md - Development guidelines and collaboration
PROJECT_STATUS.md - Setup completion status
CHECKLIST.md - Task tracking

Resources

Next.js Documentation: https://nextjs.org/docs
TypeScript Handbook: https://www.typescriptlang.org/docs
React Documentation: https://react.dev
MongoDB Documentation: https://docs.mongodb.com/
Next.js Learn Course: https://nextjs.org/learn

## Repository

URL: https://github.com/Hyrummorales23/team-activity-week-2



Last Updated: November 13, 2025  
Status: Navigation & UI Complete | Backend Development Needed



2-Minute Presentation: Navigation & UI Foundation
[Slide 1 - Introduction - 15 seconds]

"Hi everyone! I'm excited to share what I've built for our Artisan Marketplace project. I've created the complete UI foundation and navigation system that our team can now build upon."

[Slide 2 - What Was Built - 30 seconds]

"I implemented three main things:

First, a complete design system using our exact color palette - the warm terracotta, earthy green, and all the colors we agreed on. I also integrated the Roboto font throughout.

Second, I built all the navigation components - a sticky header with our logo and links, and a sidebar with all the product categories like ceramics, textiles, woodwork, and jewelry.

Third, I created six complete pages: the home page with a hero section, the catalog page with product grid and filters, login and registration pages, an artisans page, and a user profile page."

[Slide 3 - Show the Demo - 45 seconds]

"Let me quickly show you..."

[Open browser to localhost:3000]

"Here's the home page with the hero section and category cards"
"Click Catalog - you'll see the sidebar with categories and the product grid"
"Click Login - here's our authentication page"
"All routing is working - every link in the navbar connects to its page"
[Slide 4 - What's Next - 20 seconds]

"Everything you see is the visual structure - it's placeholder data right now. The real work for our team is:

Setting up MongoDB database
Creating API endpoints
Implementing authentication
Adding real products and data
Building the review system
I've documented everything in the TEAM_GUIDE and NAVIGATION_DOCS files."

[Closing - 10 seconds]

"The foundation is complete and ready. Anyone can now pull the branch, run 'npm run dev', and start building their assigned features on top of this structure. Questions?"

Key Points to Emphasize:
Complete UI/UX - All pages designed and styled
Matches Design Specs - Used exact colors and typography from team meeting
Fully Functional Navigation - All routing works
Ready for Backend - Team can immediately start on database/API work
Well Documented - Multiple guide files for collaboration
Quick Demo Path:
Home page (localhost:3000)
Click "Catalog" → Show sidebar + grid
Click "Login" → Show form
Click logo → Back to home
Show one category click
Total Time: 2 minutes ⏱️

Good luck with your presentation! 🎉

Claude Sonnet 4.5 • 1x
