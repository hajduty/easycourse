import apiClient from "@/lib/apiClient";
import { MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import type { ApiResponse } from "@/types/apiResponse";
import type { Image } from "@/types/image";


export const UploadImage = async (file: File): Promise<ApiResponse<Image>> => {
  if (!file) throw new Error("No file provided")

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`
    )
  }

  const formData = new FormData()
  formData.append("file", file)

  const { data } = await apiClient.post<ApiResponse<Image>>(
    "/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return data;
}