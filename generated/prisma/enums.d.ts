export declare const Role: {
    readonly STUDENT: "STUDENT";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const ApplicationStatus: {
    readonly NOT_STARTED: "NOT_STARTED";
    readonly APPLICATION_STARTED: "APPLICATION_STARTED";
    readonly DOCUMENTS_PENDING: "DOCUMENTS_PENDING";
    readonly READY_TO_SUBMIT: "READY_TO_SUBMIT";
    readonly SUBMITTED: "SUBMITTED";
    readonly UNDER_REVIEW: "UNDER_REVIEW";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly EXPIRED: "EXPIRED";
};
export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
