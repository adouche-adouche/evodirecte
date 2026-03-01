export interface SchoolLifeItem {
    id: number;
    type: "Absence" | "Retard" | "Punition" | string;
    date: string;
    displayDate: string;
    label: string;
    reason: string;
    isJustified: boolean;
    comment: string;
}
