export class Res {
    err!: boolean;
    message!: any;
}

export class ServerRes {
    succ!: boolean;
    message!: any;
}

export const GSRes = {
    succ: (message: any = "") => {
        return {succ: true, message: message} as ServerRes;
    },
    err: (message: any = "") => {
        return {succ: false, message: message} as ServerRes;
    }
}

export const GRes = {
    succ: (message: any = "") => {
        return {err: false, message: message} as Res;
    },
    err: (message: any = "") => {
        return {err: true, message: message} as Res;
    }
}