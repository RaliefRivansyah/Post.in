const { cloudinary } = require('../config/cloudinary');

class UploadController {
    // Upload image
    static async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            res.status(200).json({
                message: 'Image uploaded successfully',
                url: req.file.path,
                publicId: req.file.filename,
            });
        } catch (error) {
            console.error('Upload image error:', error);
            res.status(500).json({ message: 'Failed to upload image' });
        }
    }

    // Upload video
    static async uploadVideo(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            res.status(200).json({
                message: 'Video uploaded successfully',
                url: req.file.path,
                publicId: req.file.filename,
            });
        } catch (error) {
            console.error('Upload video error:', error);
            res.status(500).json({ message: 'Failed to upload video' });
        }
    }

    // Upload avatar
    static async uploadAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            res.status(200).json({
                message: 'Avatar uploaded successfully',
                url: req.file.path,
                publicId: req.file.filename,
            });
        } catch (error) {
            console.error('Upload avatar error:', error);
            res.status(500).json({ message: 'Failed to upload avatar' });
        }
    }

    // Delete media from Cloudinary
    static async deleteMedia(req, res) {
        try {
            const { publicId, resourceType = 'image' } = req.body;

            if (!publicId) {
                return res.status(400).json({ message: 'Public ID is required' });
            }

            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

            res.status(200).json({ message: 'Media deleted successfully' });
        } catch (error) {
            console.error('Delete media error:', error);
            res.status(500).json({ message: 'Failed to delete media' });
        }
    }
}

module.exports = UploadController;
