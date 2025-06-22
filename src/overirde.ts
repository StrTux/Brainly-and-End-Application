export {}; // Ensure this is an external module

declare global {
    namespace Express {
        export interface Request {
            userId?: string;
        }
    }
}
