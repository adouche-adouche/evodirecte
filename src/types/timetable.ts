export interface TimetableEvent {
    id: number;
    subject: string;
    subjectCode: string;
    type: string;
    start: string;
    end: string;
    color: string;
    isAttendanceMandatory: boolean;
    teacher: string;
    room: string;
    classLabel: string;
    groupLabel: string;
    isModified: boolean;
    isCancelled: boolean;
    hasHomework: boolean;
    hasSessionContent: boolean;
}
