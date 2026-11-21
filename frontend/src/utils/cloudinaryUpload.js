import axios from "axios";
import api from "../config/api";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Validates file type and size before any network request
 */
export const validateImageFile = (file) => {
  if (!file) {
    throw new Error("Please select an image file.");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    throw new Error(
      `Invalid image format (${file.type || "unknown"}). Allowed formats: PNG, JPG, JPEG, WEBP.`
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(
      `File size (${sizeMB} MB) exceeds the maximum limit of 10 MB. Please choose a smaller image.`
    );
  }

  return true;
};

/**
 * Direct Cloudinary Signed Upload:
 * 1. Requests a secure cryptographic signature from the backend (API Secret stays on server).
 * 2. Uploads the image binary directly from the browser to Cloudinary's REST API.
 * 3. Tracks real-time upload progress.
 * 4. Returns the permanent HTTPS secure_url and public_id.
 */
export const uploadDirectToCloudinary = async (
  file,
  { folder = "portfolio", onProgress = null } = {}
) => {
  // 1. Client-side validation
  console.log(`[Cloudinary Client] Step 1: Validating file '${file?.name}' (${file?.type}, ${(file?.size / 1024).toFixed(1)} KB)...`);
  validateImageFile(file);

  // 2. Request signed parameters from backend
  console.log(`[Cloudinary Client] Step 2: Requesting upload signature from backend for folder '${folder}'...`);
  let signData;
  try {
    const signRes = await api.post("/api/cloudinary/sign", { folder });
    signData = signRes.data?.data;
  } catch (signErr) {
    console.error("[Cloudinary Client] Backend signature request error:", signErr);
    const serverMsg = signErr.response?.data?.message || signErr.message;
    throw new Error(
      `Failed to get upload signature from server: ${serverMsg}`
    );
  }

  if (!signData || !signData.signature || !signData.apiKey || !signData.cloudName) {
    throw new Error(
      "Backend did not return valid Cloudinary upload authorization."
    );
  }

  const { signature, timestamp, apiKey, cloudName, folder: targetFolder } = signData;
  console.log(`[Cloudinary Client] Step 3: Signature received. Cloud: '${cloudName}', Key prefix: '${apiKey.slice(0, 4)}***', Timestamp: ${timestamp}`);

  // 3. Prepare direct multipart upload form data for Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  if (targetFolder) {
    formData.append("folder", targetFolder);
  }

  // 4. Perform direct upload to Cloudinary API
  try {
    const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log(`[Cloudinary Client] Step 4: Uploading binary directly to Cloudinary endpoint: ${cloudinaryUploadUrl}`);

    const uploadRes = await axios.post(cloudinaryUploadUrl, formData, {
      headers: {
        // Axios automatically sets correct multipart/form-data boundary
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    });

    const result = uploadRes.data;

    if (!result?.secure_url) {
      throw new Error("Cloudinary upload succeeded but no secure_url was returned.");
    }

    console.log(`[Cloudinary Client] Step 5: Upload succeeded! Received permanent secure_url:`, result.secure_url);
    console.log(`[Cloudinary Client] Public ID:`, result.public_id);

    return {
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    };
  } catch (uploadErr) {
    console.error("[Cloudinary Client] Direct upload failed:", uploadErr);

    const cldError = uploadErr.response?.data?.error;
    const cldMsg = cldError?.message || uploadErr.message;

    if (cldMsg.includes("missing permissions") || cldMsg.includes("actions=[\"create\"]")) {
      throw new Error(
        `Cloudinary Permissions Issue: Your Cloudinary API Key lacks 'create' permissions. In your Cloudinary Console (Settings > Access Keys / API Keys), ensure this key has upload/create permissions. Details: ${cldMsg}`
      );
    }

    if (cldMsg.includes("cloud_name is disabled")) {
      throw new Error(
        `Cloudinary Account Notice: Direct uploads are restricted for cloud '${cloudName}'. Please verify your Cloudinary account status in the Cloudinary Console.`
      );
    }

    throw new Error(`Direct Cloudinary upload failed: ${cldMsg}`);
  }
};

