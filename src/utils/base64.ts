/**
 * Utility for Base64 encoding/decoding.
 */
import { DEFAULT_USER_AGENT } from "../types";

export function encodeBase64(str: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    let binary = "";
    const len = data.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(data[i]);
    }
    return btoa(binary);
}

export function decodeBase64(base64: string): string {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
}

export async function imageUrlToBase64(url: string, fetchFn: typeof fetch = fetch): Promise<string> {
    const response = await fetchFn(url, {
        headers: { "User-Agent": DEFAULT_USER_AGENT }
    });
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Chunked processing to avoid stack overflow on very large images
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, Array.from(bytes.slice(i, i + chunkSize)));
    }

    const base64 = btoa(binary);
    const contentType = response.headers.get("Content-Type") || "image/jpeg";
    return `data:${contentType};base64,${base64}`;
}
