import {ConnectionOptions, Pool, createPool, escape} from 'mysql2';
import { config } from "dotenv";
config();

export const mode: "DEV" | "PROD" = (process.env["MODE"] || "DEV").toUpperCase() as "DEV" | "PROD";

const access: ConnectionOptions = {
    host: process.env[`DB_${mode}_HOST`],
    user: process.env[`DB_${mode}_USER`],
    password: process.env[`DB_${mode}_PASS`],
    database: process.env[`DB_${mode}_SCHEMA`],
    multipleStatements: true,
    charset: 'utf8mb4',
};

export class DB {
    private static _conn: Pool = createPool(access);

    static error = "A server error was encountered.";

    static con = (): Pool => {
        return DB._conn;
    }

    static esc = (m: any): string => {
        return escape(m);
    }

}
