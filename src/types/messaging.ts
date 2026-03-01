export interface MessageSummary {
    id: number;
    subject: string;
    excerpt: string;
    date: string;
    read: boolean;
    from: string;
    hasAttachments: boolean;
}

export interface MessageDetails extends MessageSummary {
    content: string; // Markdown
    attachments: Array<{
        id: number;
        label: string;
        size: number;
    }>;
}
