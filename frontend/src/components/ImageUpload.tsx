import { useState, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Photo {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface ImageUploadProps {
  itemId: string;
  photos: Photo[];
  onPhotosChange: () => void;
}

export default function ImageUpload({ itemId, photos, onPhotosChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug: Log props
  console.log("ImageUpload - itemId:", itemId);
  console.log("ImageUpload - photos:", photos);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const files = Array.from(fileList);

    // Validate file types
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError("Only JPG, PNG, and WebP images are allowed");
      return;
    }

    // Validate file sizes (5MB max)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError("File size must be less than 5MB");
      return;
    }

    // Limit to 10 files
    if (files.length > 10) {
      setError("You can only upload up to 10 images at once");
      return;
    }

    setError(null);
    await uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    setError(null);
    
    console.log("Uploading files:", files);
    console.log("Upload URL:", `${API_BASE_URL}/api/admin/menu/items/${itemId}/photos`);
    
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("photos", file);
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/menu/items/${itemId}/photos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload success:", response.data);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Notify parent to reload photos
      onPhotosChange();
      setError(null);
    } catch (err: any) {
      console.error("Upload error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/menu/items/${itemId}/photos/${photoId}`
      );
      onPhotosChange();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete photo");
      console.error("Delete error:", err);
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/admin/menu/items/${itemId}/photos/${photoId}/primary`
      );
      onPhotosChange();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to set primary photo");
      console.error("Set primary error:", err);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <label style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: "#cbd5e1" }}>
        📷 Photos
      </label>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        style={{
          border: dragActive ? "2px dashed #6366f1" : "2px dashed #334155",
          borderRadius: "8px",
          padding: "30px",
          textAlign: "center",
          cursor: "pointer",
          background: dragActive ? "#1e40af20" : "#0f172a",
          transition: "all 0.3s ease",
          marginBottom: "20px",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <div style={{ fontSize: "40px", marginBottom: "10px" }}>
          {uploading ? "⏳" : "📸"}
        </div>
        <p style={{ color: "#cbd5e1", marginBottom: "5px", fontSize: "16px" }}>
          {uploading ? "Uploading..." : "Click or drag images here to upload"}
        </p>
        <p style={{ color: "#64748b", fontSize: "13px" }}>
          JPG, PNG, WebP • Max 5MB per file • Up to 10 files
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            background: "#7f1d1d",
            color: "#fee2e2",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            border: "1px solid #dc2626",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Photos Grid */}
      {photos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "15px",
          }}
        >
          {photos.map((photo) => (
            <div
              key={photo.id}
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                border: photo.isPrimary ? "3px solid #6366f1" : "1px solid #334155",
                background: "#0f172a",
              }}
            >
              {/* Primary Badge */}
              {photo.isPrimary && (
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    background: "#6366f1",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "600",
                    zIndex: 10,
                  }}
                >
                  ⭐ Primary
                </div>
              )}

              {/* Image */}
              <img
                src={`${API_BASE_URL}${photo.url}`}
                alt="Menu item"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/150?text=Error";
                }}
              />

              {/* Action Buttons */}
              <div
                style={{
                  padding: "8px",
                  display: "flex",
                  gap: "5px",
                  justifyContent: "space-between",
                }}
              >
                {!photo.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(photo.id)}
                    title="Set as primary"
                    style={{
                      background: "#334155",
                      color: "#cbd5e1",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 10px",
                      fontSize: "12px",
                      cursor: "pointer",
                      flex: 1,
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#6366f1";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "#334155";
                      e.currentTarget.style.color = "#cbd5e1";
                    }}
                  >
                    ⭐ Set Primary
                  </button>
                )}
                <button
                  onClick={() => handleDelete(photo.id)}
                  title="Delete photo"
                  style={{
                    background: "#7f1d1d",
                    color: "#fca5a5",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 10px",
                    fontSize: "12px",
                    cursor: "pointer",
                    flex: photo.isPrimary ? 1 : 0,
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#dc2626";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#7f1d1d";
                    e.currentTarget.style.color = "#fca5a5";
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && !uploading && (
        <div
          style={{
            textAlign: "center",
            padding: "30px",
            background: "#0f172a",
            borderRadius: "8px",
            border: "1px solid #334155",
          }}
        >
          <div style={{ fontSize: "50px", marginBottom: "10px" }}>🖼️</div>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            No photos uploaded yet
          </p>
        </div>
      )}
    </div>
  );
}
