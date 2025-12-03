# Deployment Guide

## Deploying to Vercel (Recommended)

### Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. Your OpenAI API key

### Steps

1. **Install Vercel CLI** (if deploying via CLI):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to https://vercel.com/new
   - Import your Git repository
   - Vercel will auto-detect the Node.js project
   - Add environment variable: `OPENAI_API_KEY` with your API key
   - Click Deploy

3. **Deploy via CLI**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked for environment variables, add `OPENAI_API_KEY`

4. **Set Environment Variables**:
   - In Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `OPENAI_API_KEY` = `your-api-key-here`
   - Redeploy after adding

### Alternative: Deploy to Other Platforms

#### Netlify
- Use Netlify Functions for the API endpoint
- Requires converting `/api/chat.js` to Netlify function format

#### Railway/Render
- Can deploy Node.js apps directly
- Set `OPENAI_API_KEY` as environment variable
- Point to `server.js` as entry point

## Environment Variables

Make sure to set `OPENAI_API_KEY` in your production environment. Never commit the `.env` file to Git.

## Post-Deployment

1. Test the API endpoint: `https://your-domain.vercel.app/api/chat`
2. Test the main site: `https://your-domain.vercel.app`
3. Verify branch functionality works correctly

