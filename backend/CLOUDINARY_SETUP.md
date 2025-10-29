# Cloudinary Integration Setup Guide

This project uses Cloudinary for cloud-based image storage and management.

## Features

✅ **Automatic Image Upload** - Images are uploaded directly to Cloudinary
✅ **Image Optimization** - Automatic compression and format conversion
✅ **Image Transformation** - Auto-resize to max 1000x1000px
✅ **Image Deletion** - Automatic cleanup when products are deleted
✅ **CDN Delivery** - Fast image delivery via Cloudinary CDN

## Setup Instructions

### 1. Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. After signing in, go to your **Dashboard**

### 2. Get Your Credentials

From your Cloudinary Dashboard, you'll find:
- **Cloud Name**
- **API Key**
- **API Secret**

### 3. Configure Environment Variables

Add the following to your `.env` file in the backend directory:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Replace the placeholder values with your actual Cloudinary credentials.

### 4. Install Dependencies

The required packages are already installed:
```bash
npm install cloudinary multer-storage-cloudinary
```

## How It Works

### Image Upload Flow

1. **Frontend** - User selects images in the add/edit product form
2. **Multer** - Handles multipart/form-data
3. **Cloudinary Storage** - Uploads images to Cloudinary
4. **Database** - Stores Cloudinary URLs and public IDs
5. **Frontend Display** - Shows images from Cloudinary CDN

### Image Storage Structure

```javascript
images: [
  {
    url: "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/women-clothing/abc123.jpg",
    publicId: "women-clothing/abc123",
    alt: "Product Name"
  }
]
```

### Cloudinary Configuration

Located in: `backend/config/cloudinary.js`

```javascript
// Image transformations applied automatically:
- Max dimensions: 1000x1000px (maintains aspect ratio)
- Quality: Auto (optimized for web)
- Format: Auto (WebP when supported, fallback to original)
```

### Upload Middleware

Located in: `backend/middleware/upload.js`

- **Max file size**: 5MB (configurable via MAX_FILE_SIZE env var)
- **Allowed formats**: jpg, jpeg, png, gif, webp
- **Max images per product**: 5

## API Endpoints

### Create Product with Images
```http
POST /api/products/add
Content-Type: multipart/form-data

Form Data:
- name: "Product Name"
- description: "Product Description"
- price: 1999
- images: [file1, file2, file3] (max 5)
```

### Update Product with New Images
```http
PUT /api/products/:id
Content-Type: multipart/form-data

Form Data:
- (any product fields to update)
- images: [newFile1, newFile2] (appends to existing images)
```

### Delete Specific Image
```http
DELETE /api/products/:id/images/:publicId
```

### Delete Product (deletes all images)
```http
DELETE /api/products/:id
```

## Folder Structure in Cloudinary

All product images are stored in the `women-clothing` folder in your Cloudinary account:

```
women-clothing/
  ├── image1.jpg
  ├── image2.jpg
  └── image3.jpg
```

## Frontend Integration

The add product page (`admin/src/app/products/add/page.tsx`) is already configured to work with Cloudinary:

- Image preview before upload
- FormData for file upload
- Multiple image support (up to 5)
- Automatic product creation with Cloudinary URLs

## Benefits of Cloudinary

1. **No Local Storage** - Images stored in the cloud, not on your server
2. **Fast CDN** - Global CDN for fast image delivery
3. **Auto Optimization** - Automatic image compression and format conversion
4. **Scalable** - Handles any number of images
5. **Transformations** - On-the-fly image resizing and effects
6. **Free Tier** - 25GB storage and 25GB bandwidth per month

## Troubleshooting

### Images not uploading?
- Check your Cloudinary credentials in `.env`
- Verify file size is under 5MB
- Check file format is supported (jpg, jpeg, png, gif, webp)

### Images not displaying?
- Check if Cloudinary URL is stored in database
- Verify Cloudinary account is active
- Check browser console for CORS errors

### Delete not working?
- Verify publicId is stored correctly
- Check Cloudinary API permissions
- Review backend logs for errors

## Free Tier Limits

Cloudinary free tier includes:
- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Images**: Unlimited

This is more than enough for a small to medium e-commerce store!

## Need Help?

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Multer Storage Cloudinary](https://github.com/affanshahid/multer-storage-cloudinary)
