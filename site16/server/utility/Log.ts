import { config } from "dotenv";
config();

export const prod: boolean = process.env["MODE"] == "PROD";

export class Log {
    static dev = (message: any): void => {
        if (!prod) {
            console.log(message);
        }
    }
}
