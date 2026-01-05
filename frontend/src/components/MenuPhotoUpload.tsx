import { useState, useRef, DragEvent, ChangeEvent } from "react";
import "./MenuPhotoUpload.css";

export interface PhotoData {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface MenuPhotoUploadProps {
  itemId: string;
  photos: PhotoData[];
  onPhotosChange: (photos: PhotoData[]) => void;
}

export default function MenuPhotoUpload({
  itemId,
  photos,
  onPhotosChange,
}: MenuPhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/menu/items/${itemId}/photos`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload photos");
      }

      const result = await response.json();
      onPhotosChange([...photos, ...result.photos]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photos. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/menu/items/${itemId}/photos/${photoId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete photo");
      }

      onPhotosChange(photos.filter((p) => p.id !== photoId));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete photo. Please try again.");
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/menu/items/${itemId}/photos/${photoId}/primary`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to set primary photo");
      }

      // Update local state
      onPhotosChange(
        photos.map((p) =>
          p.id === photoId
            ? { ...p, isPrimary: true }
            : { ...p, isPrimary: false }
        )
      );
    } catch (error) {
      console.error("Set primary error:", error);
      alert("Failed to set primary photo. Please try again.");
    }
  };

  return (
    <div className="menu-photo-upload">
      <h3>Menu Item Photos</h3>

      {/* Upload Zone */}
      <div
        className={`upload-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <div className="upload-zone-content">
          {uploading ? (
            <p>Uploading...</p>
          ) : (
            <>
              <p className="upload-icon">📸</p>
              <p>Drag & drop photos here or click to select</p>
              <p className="upload-hint">Supports JPG, PNG, WebP (max 5MB)</p>
            </>
          )}
        </div>
      </div>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <div className="photo-gallery">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-item">
              <img
                src={`${API_BASE_URL}${photo.url}`}
                alt="Menu item"
                className="photo-preview"
              />
              {photo.isPrimary && (
                <span className="primary-badge">Primary</span>
              )}
              <div className="photo-actions">
                {!photo.isPrimary && (
                  <button
                    className="btn-set-primary"
                    onClick={() => handleSetPrimary(photo.id)}
                  >
                    Set as Primary
                  </button>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(photo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
