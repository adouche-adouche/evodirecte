export interface HomeworkDay {
    date: string;
    items: HomeworkItem[];
}

export interface HomeworkItem {
    id: number;
    subject: string;
    subjectCode: string;
    isDone: boolean;
    isTest: boolean;
    mustSubmitOnline: boolean;
    givenOn: string;
}

export interface HomeworkDetails {
    id: number;
    subject: string;
    subjectCode: string;
    teacher: string;
    content: string; // Markdown
    isDone: boolean;
    isTest: boolean;
    givenOn: string;
    attachments: Attachment[];
    sessionContent?: SessionContent;
}

export interface Attachment {
    id: number;
    label: string;
    type: string;
    size: number;
}

export interface SessionContent {
    content: string; // Markdown
    attachments: Attachment[];
}
