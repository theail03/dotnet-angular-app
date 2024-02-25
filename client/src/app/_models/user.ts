export interface User {
    id: number;
    googleId: string;
    username: string;
    token: string;
    photoUrl: string;
    name: string;
    roles: string[];
    created: Date;
    lastActive: Date;
}