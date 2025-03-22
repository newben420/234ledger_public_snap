import {v4 as uuidv4, validate} from "uuid";

export class UUIDHelper {
    static generate = (): string => {
        return uuidv4();
    }

    static validate = (ud: string): boolean => {
        return validate(ud);
    }
}