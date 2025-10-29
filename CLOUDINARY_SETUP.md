# Cloudinary Setup Guide

To enable mobile image uploads that work on Render, you need to set up a free Cloudinary account.

## Step 1: Create Free Cloudinary Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account
3. Verify your email

## Step 2: Get Your API Credentials

1. After logging in, you'll see your **Cloud name**
2. Click on the dashboard
3. You'll see your:
   - **API Key**
   - **API Secret** (keep this secret!)

## Step 3: Add to Render

1. Go to your Render dashboard
2. Click on your `travel-tots` web service
3. Go to **Environment** tab
4. Add these three environment variables:

```
Name: CLOUDINARY_CLOUD_NAME
Value: (your cloud name from step 2)

Name: CLOUDINARY_API_KEY  
Value: (your API key from step 2)

Name: CLOUDINARY_API_SECRET
Value: (your API secret from step 2)
```

5. Click **Save Changes**
6. Render will automatically redeploy with the new settings

## What This Gives You

✅ Upload images directly from your phone  
✅ Images stored in the cloud (won't get deleted)  
✅ Works on Render  
✅ Free tier includes 25GB storage and 25GB bandwidth per month  

## Without Cloudinary

If you don't set up Cloudinary, image uploads will:
- ✅ Work on localhost
- ❌ Not work on Render (files get deleted on restart)

## Testing

After adding the environment variables:
1. Wait for deployment to complete
2. Go to admin on your phone
3. Try uploading an image when creating a product
4. It should work! 🎉

