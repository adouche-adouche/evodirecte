import { Fetcher } from "../utils/fetcher";
import { evoDirecte } from "../core/evoDirecte";
import { Grade, Period, SubjectGrade } from "../types/grades";

export class GradesManager {
    constructor(private fetcher: Fetcher, private client: evoDirecte) {}

    async getGrades(schoolYear: string = ""): Promise<{ periods: Period[], grades: Grade[] }> {
        this.client.checkModule("NOTES");
        // Use POST with verbe=get for data tunneling
        const data = await this.client.request<any>({
            method: "POST",
            path: `/eleves/${this.client.accountId}/notes.awp`,
            params: { verbe: "get" },
            body: { anneeScolaire: schoolYear }
        });

        const periods: Period[] = data.periodes.map((p: any) => ({
            id: p.idPeriode,
            code: p.codePeriode,
            label: p.periode,
            isAnnual: p.annuel,
            start: p.dateDebut,
            end: p.dateFin,
            isClosed: p.cloture,
            overallAverage: this.parseNumber(p.ensembleMatieres.moyenneGenerale),
            classAverage: this.parseNumber(p.ensembleMatieres.moyenneClasse),
            subjects: p.ensembleMatieres.disciplines.map((d: any) => ({
                id: d.id,
                subjectCode: d.codeMatiere,
                subjectLabel: d.discipline,
                average: this.parseNumber(d.moyenne),
                classAverage: this.parseNumber(d.moyenneClasse),
                classMin: this.parseNumber(d.moyenneMin),
                classMax: this.parseNumber(d.moyenneMax),
                coefficient: d.coef,
                rank: d.rang,
                teachers: d.professeurs.map((prof: any) => ({ id: prof.id, name: prof.nom }))
            }))
        }));

        const grades: Grade[] = data.notes.map((n: any) => ({
            id: n.id,
            title: n.devoir,
            periodCode: n.codePeriode,
            subjectCode: n.codeMatiere,
            subjectLabel: n.libelleMatiere,
            type: n.typeDevoir,
            comment: n.commentaire,
            coefficient: this.parseNumber(n.coef) || 0,
            outOf: this.parseNumber(n.noteSur) || 20,
            value: this.parseNumber(n.valeur),
            isLetter: n.enLettre,
            date: n.date,
            dateEntered: n.dateSaisie,
            classAverage: this.parseNumber(n.moyenneClasse),
            classMin: this.parseNumber(n.minClasse),
            classMax: this.parseNumber(n.maxClasse)
        }));

        return { periods, grades };
    }

    private parseNumber(val: string | number): number | undefined {
        if (val === undefined || val === null || val === "") return undefined;
        if (typeof val === "number") return val;
        const parsed = parseFloat(val.replace(",", "."));
        return isNaN(parsed) ? undefined : parsed;
    }
}
