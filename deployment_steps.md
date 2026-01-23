# Backend Deployment Guide (Render.com)

This guide outlines the steps to deploy your Node.js backend to Render.

## Prerequisites
- A GitHub repository containing your project (which you have).
- A [Render.com](https://render.com) account.

## Step 1: Create a New Web Service
1. Log in to your Render dashboard.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository (`jan-coho`).

## Step 2: Configure Service Settings
Since your backend code lives in a subdirectory (`backend-node`), you must configure the **Root Directory** correctly.

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Name** | `jan-coho-backend` (or similar) | |
| **Region** | (Choose closest to users) | |
| **Branch** | `main` (or your working branch) | |
| **Root Directory** | `backend-node` | **Important:** This tells Render where your specific package.json is. |
| **Runtime** | Node | |
| **Build Command** | `npm install` | Installs dependencies. |
| **Start Command** | `node src/server.js` | **Important:** We use this directly instead of `npm start` because your current `npm start` script uses `nodemon` (which is for development). |

## Step 3: Environment Variables
You must verify and add these securely in the "Environment" tab of your service setup.

1. Scroll down to **Environment Variables**.
2. Add the following keys (copy values from your local `.env` file):

| Key | Value |
| :--- | :--- |
| `MONGO_URI` | `mongodb+srv://...` (Your full connection string) |
| `OPENROUTER_API_KEY` | `sk-...` (Your API key) |
| `PORT` | `10000` (Optional, Render sets this automatically) |

> [!IMPORTANT]
> Ensure your MongoDB cluster allows access from **Anywhere (0.0.0.0/0)** in the Network Access settings on MongoDB Atlas, as Render IP addresses change.

## Step 4: Deploy
1. Click **Create Web Service**.
2. Render will start the build. Watch the logs.
3. Once the build finishes, you will see a green **Live** status.

## Step 5: Verification
Once live, you can test the health check endpoint:
- **URL**: `https://your-service-name.onrender.com/`
- **Expected Output**: `API running 🚀 (PID: ...)`

## Troubleshooting common issues
- **Build Failed**: Check if `Root Directory` is set to `backend-node`.
- **Deploy Failed (Start)**: Ensure `Start Command` is `node src/server.js`.
- **Database Error**: Check `MONGO_URI` and ensure MongoDB Atlas Network Access whitelist includes `0.0.0.0/0`.
