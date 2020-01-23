export interface Loginoplysninger {
    result?: {
        email?: string;
        uid?: string;
    }
    error?: {
        code?: string;
        message?: string;
    }
}