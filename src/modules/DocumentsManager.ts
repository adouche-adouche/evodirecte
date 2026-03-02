import { Fetcher } from "../utils/fetcher";
import { wrapDirecte } from "../core/wrapDirecte";
import { EDDocument, DocumentsList } from "../types/documents";

export class DocumentsManager {
    constructor(private fetcher: Fetcher, private client: wrapDirecte) {}

    async getDocuments(archive: string = ""): Promise<DocumentsList> {
        this.client.checkModule("DOCUMENTS_ELEVE");
        const data = await this.client.request<any>({
            method: "GET",
            path: "/elevesDocuments.awp",
            params: { archive }
        });

        const transform = (docs: any[]): EDDocument[] => (docs || []).map(d => ({
            id: d.id,
            label: d.libelle,
            date: d.date,
            type: d.type
        }));

        return {
            grades: transform(data.notes),
            schoolLife: transform(data.viescolaire),
            administrative: transform(data.administratifs)
        };
    }

    async getDownloadUrl(documentId: number, isArchive: boolean = false): Promise<string> {
        const url = new URL("https://api.ecoledirecte.com/v3/telechargement.awp");
        url.searchParams.set("fichierId", documentId.toString());
        if (isArchive) url.searchParams.set("archive", "true");
        return url.toString();
    }
}
