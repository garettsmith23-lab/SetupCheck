# SetupCheck — Deployment Guide

This guide walks you through getting your app live on the internet, step by step. 
No coding experience needed. Just follow each step in order.

Total time: about 1-2 hours for first-time setup.

---

## STEP 1: Create your accounts (15 minutes)

You need three free accounts. Open each in a new tab and sign up:

### 1A: GitHub (stores your code)
- Go to https://github.com
- Click "Sign up"
- Use your email, create a password, pick a username
- Verify your email
- When asked about preferences, you can skip everything

### 1B: Vercel (hosts your app on the internet)
- Go to https://vercel.com
- Click "Sign Up"
- Choose "Continue with GitHub" (this connects them automatically)
- Authorize Vercel to access your GitHub

### 1C: Anthropic Console (gives you the API key)
- Go to https://console.anthropic.com
- Sign up or log in
- You'll need to add a payment method (the API charges per use, roughly $0.05-0.15 per stock analysis)
- Go to Settings > API Keys
- Click "Create Key"
- IMPORTANT: Copy this key and save it somewhere safe (like a note on your phone). You'll need it in Step 3. It starts with "sk-ant-"

---

## STEP 2: Upload your code to GitHub (15 minutes)

### 2A: Create a new repository
- On GitHub, click the "+" icon in the top right corner
- Click "New repository"
- Name it: setupcheck
- Keep it set to "Public" (Vercel's free tier requires public repos)
- Check the box "Add a README file"
- Click "Create repository"

### 2B: Upload all the project files
- On your new repository page, click "Add file" > "Upload files"
- Drag ALL the files and folders from the SetupCheck folder I gave you into the upload area
- The file structure should look like:
  ```
  setupcheck/
    app/
      api/
        analyze/
          route.js
      review/
        page.js
      globals.css
      layout.js
      page.js
    public/
    .env.example
    next.config.js
    package.json
  ```
- IMPORTANT: Make sure the "app" folder is at the TOP level of the repository, not nested inside another folder
- Write a commit message like "Initial upload"
- Click "Commit changes"

### 2C: Verify the upload
- You should now see all your files listed on the repository page
- Click into the "app" folder and make sure you see: api/, review/, globals.css, layout.js, page.js
- Click into "app/api/analyze/" and make sure you see route.js

---

## STEP 3: Deploy on Vercel (15 minutes)

### 3A: Import your project
- Go to https://vercel.com/dashboard
- Click "Add New..." > "Project"
- You should see your "setupcheck" repository listed
- Click "Import" next to it

### 3B: Configure the project
- Project Name: setupcheck (or whatever you want)
- Framework Preset: it should auto-detect "Next.js" — if not, select it
- Root Directory: leave as "./" (the default)
- IMPORTANT — Environment Variables: 
  - Click "Environment Variables"
  - In the "Name" field, type: ANTHROPIC_API_KEY
  - In the "Value" field, paste your API key (the one starting with sk-ant- from Step 1C)
  - Click "Add"

### 3C: Deploy
- Click "Deploy"
- Wait 1-2 minutes while it builds
- If it says "Congratulations!" — your app is LIVE
- Vercel gives you a URL like: setupcheck.vercel.app
- Click "Visit" to see your app

### 3D: If the build fails
- Don't panic. Click "View Build Logs"
- Screenshot the error and start a new chat with me on Claude
- Say "my SetupCheck build failed, here's the error" and paste/upload the screenshot
- I'll tell you exactly what to fix

---

## STEP 4: Test it (5 minutes)

- Visit your URL (setupcheck.vercel.app or whatever Vercel assigned)
- You should see the landing page with "Know if a stock is buyable in 30 seconds"
- Click "Launch tool" or navigate to /review
- Type "AAPL" in the input box and click "Run check"
- Wait 15-20 seconds
- You should see the full 5-step analysis appear

If the analysis fails:
- Go back to Vercel dashboard
- Click on your project > Settings > Environment Variables
- Make sure ANTHROPIC_API_KEY is there and the value is correct
- If you changed it, click "Redeploy" from the Deployments tab

---

## STEP 5: Get a custom domain (optional, 10 minutes)

Your app works at setupcheck.vercel.app, but if you want a custom domain like setupcheck.com:

- Buy a domain at https://namecheap.com or https://domains.google (about $10-15/year)
- In Vercel, go to your project > Settings > Domains
- Type your domain name and click "Add"
- Vercel will give you DNS records to add
- Go to your domain registrar (Namecheap/Google) and add those DNS records
- Wait 15-30 minutes for it to activate

---

## HOW TO UPDATE THE APP

When you want to change something:
1. Go to your repository on GitHub
2. Navigate to the file you want to change
3. Click the pencil icon (edit)
4. Make your changes
5. Click "Commit changes"
6. Vercel automatically deploys the update within 1-2 minutes

---

## COST BREAKDOWN

- GitHub: Free
- Vercel: Free (for personal/hobby projects)
- Anthropic API: Pay-per-use
  - Each stock analysis costs roughly $0.05-0.15
  - 100 analyses/month = about $5-15/month
  - 1,000 analyses/month = about $50-150/month
- Custom domain: $10-15/year (optional)

---

## NEXT STEPS (future upgrades)

When you're ready to add paid subscriptions:
- Add Stripe for payments (I can build this for you)
- Add user accounts with NextAuth.js
- Add usage limits (free tier gets 5 analyses/day, paid gets unlimited)
- Add saved analysis history
- Add portfolio tracking

Start a new chat with me anytime and say "let's add payments to SetupCheck" and I'll build it.

---

## GETTING HELP

If anything goes wrong at any step:
1. Take a screenshot of what you see
2. Open a new Claude chat in this project
3. Tell me which step you're on and what happened
4. I'll walk you through the fix

You've got this. The hardest part is the first deploy — after that, updates are just editing files on GitHub.
