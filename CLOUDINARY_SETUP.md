# Cloudinary Setup Guide

## Overview

This project now supports image and video uploads using Cloudinary, replacing the URL-based media system.

## Features

-   **Image Uploads**: Up to 5MB (JPG, PNG, GIF, WEBP)
-   **Video Uploads**: Up to 50MB (MP4, MOV, AVI, WEBM)
-   **Avatar Uploads**: Up to 2MB with automatic face detection and cropping
-   **Drag & Drop**: User-friendly upload interface
-   **Real-time Preview**: See media before posting
-   **Progress Tracking**: Visual upload progress indicators

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. After signing in, go to your Dashboard

### 2. Get Your Credentials

From your Cloudinary Dashboard, copy:

-   **Cloud Name**
-   **API Key**
-   **API Secret**

### 3. Configure Environment Variables

Update `Server/.env` with your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 4. Folder Structure in Cloudinary

The app automatically organizes uploads into folders:

-   `postin/posts` - Post images
-   `postin/videos` - Post videos
-   `postin/avatars` - User avatars

## API Endpoints

### Upload Image

```
POST /api/upload/image
Content-Type: multipart/form-data
Body: { image: <file> }
Response: { url: string, publicId: string }
```

### Upload Video

```
POST /api/upload/video
Content-Type: multipart/form-data
Body: { video: <file> }
Response: { url: string, publicId: string }
```

### Upload Avatar

```
POST /api/upload/avatar
Content-Type: multipart/form-data
Body: { avatar: <file> }
Response: { url: string, publicId: string }
```

### Delete Media

```
DELETE /api/upload/media
Body: { publicId: string, resourceType: 'image' | 'video' }
Response: { message: string }
```

## Usage in Frontend

### Creating a Post with Media

1. Navigate to Create Post page
2. Click "📷 Image" or "🎥 Video" button
3. Upload file via:
    - Click the upload area to select a file
    - Drag and drop a file
4. Preview appears immediately
5. Complete the post form and submit

### MediaUploader Component

```jsx
import MediaUploader from '../components/MediaUploader';

<MediaUploader
    mediaType="image" // or "video"
    onUploadComplete={(media) => {
        console.log('Uploaded:', media.url);
    }}
/>;
```

## Database Schema

### Posts Table

-   `imageUrl` (STRING) - Cloudinary image URL
-   `videoUrl` (STRING) - Cloudinary video URL
-   `mediaType` (ENUM: 'image', 'video') - Type of media attached

## File Size Limits

-   Images: 5MB maximum
-   Videos: 50MB maximum
-   Avatars: 2MB maximum

## Supported Formats

### Images

-   JPEG/JPG
-   PNG
-   GIF
-   WEBP

### Videos

-   MP4
-   MOV
-   AVI
-   WEBM

## Automatic Optimizations

### Images

-   Automatically resized to max 1200x1200px
-   Maintains aspect ratio
-   Optimized for web delivery

### Videos

-   Original quality preserved
-   Automatic format conversion for web playback

### Avatars

-   Cropped to 400x400px
-   Face detection and centering
-   Circular display in UI

## Security

-   All uploads require authentication
-   File type validation
-   File size validation
-   Cloudinary handles storage security

## Troubleshooting

### "Upload failed" error

-   Check your Cloudinary credentials in `.env`
-   Ensure file size is within limits
-   Verify file format is supported

### "No file uploaded" error

-   Ensure file is selected before submitting
-   Check browser console for errors

### Videos not playing

-   Verify browser supports the video format
-   Check Cloudinary dashboard for upload status
-   Ensure video URL is valid

## Cost Considerations

### Free Tier Limits

-   25 monthly credits
-   25GB storage
-   25GB bandwidth

### Recommendations

-   Monitor usage in Cloudinary Dashboard
-   Consider upgrading for production use
-   Implement user upload limits if needed

## Next Steps

1. Get Cloudinary credentials
2. Update `.env` file
3. Restart the server
4. Test uploads in Create Post page
5. Verify media displays correctly in feed

## Support

For Cloudinary-specific issues, visit:

-   [Cloudinary Documentation](https://cloudinary.com/documentation)
-   [Cloudinary Support](https://support.cloudinary.com/)
