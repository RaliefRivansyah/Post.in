import { useState, useRef } from 'react';
import { uploadImage, uploadVideo } from '../services/api.service';

export default function MediaUploader({ onUploadComplete, mediaType = 'image' }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const acceptedFormats =
        mediaType === 'image' ? 'image/jpeg,image/jpg,image/png,image/gif,image/webp' : 'video/mp4,video/mov,video/avi,video/webm';

    const maxSize = mediaType === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size
        if (file.size > maxSize) {
            setError(`File size must be less than ${mediaType === 'image' ? '5MB' : '50MB'}`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        setError(null);
        handleUpload(file);
    };

    const handleUpload = async (file) => {
        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            const formData = new FormData();
            formData.append(mediaType, file);

            // Simulate progress for user feedback
            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = mediaType === 'image' ? await uploadImage(formData) : await uploadVideo(formData);

            clearInterval(progressInterval);
            setProgress(100);

            if (onUploadComplete) {
                onUploadComplete({
                    url: response.url,
                    publicId: response.publicId,
                    mediaType,
                });
            }

            // Reset after a short delay
            setTimeout(() => {
                setPreview(null);
                setProgress(0);
            }, 1000);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (file) {
            fileInputRef.current.files = e.dataTransfer.files;
            handleFileSelect({ target: { files: [file] } });
        }
    };

    return (
        <div className="media-uploader">
            <div
                className="upload-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}>
                {preview ? (
                    <div className="preview-container">
                        {mediaType === 'image' ? (
                            <img src={preview} alt="Preview" className="preview-image" />
                        ) : (
                            <video src={preview} controls className="preview-video" />
                        )}
                        {uploading && (
                            <div className="upload-progress">
                                <div className="progress-bar" style={{ width: `${progress}%` }} />
                                <span className="progress-text">{progress}%</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="upload-text">Click or drag to upload {mediaType}</p>
                        <p className="upload-hint">
                            {mediaType === 'image' ? 'JPG, PNG, GIF, WEBP up to 5MB' : 'MP4, MOV, AVI, WEBM up to 50MB'}
                        </p>
                    </div>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats}
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
            />

            <style>{`
                .media-uploader {
                    width: 100%;
                }

                .upload-area {
                    border: 2px dashed #E0E0E0;
                    border-radius: 8px;
                    padding: 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    background: #F5F5F5;
                }

                .upload-area:hover {
                    border-color: #6C63FF;
                    background: #F5F5F5;
                }

                .preview-container {
                    position: relative;
                    max-width: 100%;
                }

                .preview-image,
                .preview-video {
                    max-width: 100%;
                    max-height: 400px;
                    border-radius: 8px;
                    object-fit: cover;
                }

                .upload-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(26, 26, 26, 0.8);
                    padding: 0.5rem;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }

                .progress-bar {
                    height: 4px;
                    background: #6C63FF;
                    transition: width 0.3s;
                    border-radius: 2px;
                }

                .progress-text {
                    color: white;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: block;
                }

                .upload-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .upload-icon {
                    width: 48px;
                    height: 48px;
                    color: #5F5F5F;
                }

                .upload-text {
                    font-size: 1rem;
                    color: #1A1A1A;
                    font-weight: 500;
                    margin: 0;
                }

                .upload-hint {
                    font-size: 0.875rem;
                    color: #5F5F5F;
                    margin: 0;
                }

                .error-message {
                    margin-top: 0.5rem;
                    padding: 0.75rem;
                    background: #fed7d7;
                    color: #c53030;
                    border-radius: 4px;
                    font-size: 0.875rem;
                }

                .hidden {
                    display: none;
                }
            `}</style>
        </div>
    );
}
