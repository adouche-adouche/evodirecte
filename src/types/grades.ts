export interface Grade {
    id: number;
    title: string;
    periodCode: string;
    subjectCode: string;
    subjectLabel: string;
    type: string;
    comment: string;
    coefficient: number;
    outOf: number;
    value: number;
    isLetter: boolean;
    date: string;
    dateEntered: string;
    classAverage: number;
    classMin: number;
    classMax: number;
}

export interface Period {
    id: string;
    code: string;
    label: string;
    isAnnual: boolean;
    start: string;
    end: string;
    isClosed: boolean;
    overallAverage?: number;
    classAverage?: number;
    subjects: SubjectGrade[];
}

export interface SubjectGrade {
    id: number;
    subjectCode: string;
    subjectLabel: string;
    average?: number;
    classAverage?: number;
    classMin?: number;
    classMax?: number;
    coefficient: number;
    rank?: number;
    teachers: Array<{ id: number, name: string }>;
}
