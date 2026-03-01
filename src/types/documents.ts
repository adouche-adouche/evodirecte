export interface EDDocument {
    id: number;
    label: string;
    date: string;
    type: string;
}

export interface DocumentsList {
    grades: EDDocument[];
    schoolLife: EDDocument[];
    administrative: EDDocument[];
}
