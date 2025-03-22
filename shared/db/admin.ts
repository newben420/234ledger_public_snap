export class Admin {
    id?: number;
    username!: string;
    password?: string;
    last_logged_in?: string;
    last_modified?: string;
    modules?: any[];
    read_only?: 0 | 1;
    jwt?: string;
}