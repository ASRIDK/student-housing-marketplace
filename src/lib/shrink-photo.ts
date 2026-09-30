// Browser-only. Phone photos are often 3–8 MB each; the analysis only needs
// enough detail to recognise a room, so each photo is redrawn at most 1280px
// on its long edge as a JPEG (a few hundred KB) before it is sent.

const MAX_EDGE = 1280;
const QUALITY = 0.82;

/**
 * A smaller JPEG copy of `file`. If the browser cannot decode the format
 * (HEIC on most browsers other than Safari), the original file is returned
 * and the server decides whether it can take it.
 */
export async function shrinkPhoto(file: File): Promise<Blob> {
  try {
    // "from-image" applies the camera's rotation, so portrait photos stay upright.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY)
    );
    return blob ?? file;
  } catch {
    return file;
  }
}
