import { Fetcher } from "../utils/fetcher";
import { wrapDirecte } from "../core/wrapDirecte";
import { TimetableEvent } from "../types/timetable";

export class TimetableManager {
    constructor(private fetcher: Fetcher, private client: wrapDirecte) {}

    async getTimetable(startDate: string, endDate: string): Promise<TimetableEvent[]> {
        this.client.checkModule("EDT");
        const data = await this.client.request<any[]>({
            method: "POST",
            path: `/E/${this.client.accountId}/emploidutemps.awp`,
            params: { verbe: "get" },
            body: {
                dateDebut: startDate,
                dateFin: endDate,
                avecTrous: false
            }
        });

        return data.map((e: any) => ({
            id: e.id,
            subject: e.matiere || e.text,
            subjectCode: e.codeMatiere,
            type: e.typeCours,
            start: e.start_date,
            end: e.end_date,
            color: e.color,
            isAttendanceMandatory: !e.dispensable,
            teacher: e.prof,
            room: e.salle,
            classLabel: e.classe,
            groupLabel: e.groupe,
            isModified: e.isModifie,
            isCancelled: e.isAnnule,
            hasHomework: e.devoirAFaire,
            hasSessionContent: e.contenuDeSeance
        }));
    }
}
