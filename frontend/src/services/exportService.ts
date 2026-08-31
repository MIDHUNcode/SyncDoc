const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

export async function exportDocumentPDF(
    documentId: string,
): Promise<Blob> {
    const response = await fetch(
        `${API_BASE_URL}/documents/${documentId}/export/pdf`,
    );

    if (!response.ok) {
        let message =
            "Failed to export document as PDF.";

        try {
            const data = await response.json();

            if (data?.message) {
                message = data.message;
            }
        } catch {
            // Response was not JSON.
        }

        throw new Error(message);
    }

    return response.blob();
}

export function downloadPDF(
    blob: Blob,
    documentTitle: string,
): void {
    const url =
        window.URL.createObjectURL(blob);

    const anchor =
        document.createElement("a");

    anchor.href = url;
    anchor.download =
        `${documentTitle || "document"}.pdf`;

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    window.URL.revokeObjectURL(url);
}