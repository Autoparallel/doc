declare module 'bcrypt' {
    export function compare(data: string, encrypted: string): Promise<boolean>;
    export function hash(data: string, saltOrRounds: number): Promise<string>;
} 