export class LocalRegex{
    static storageKey = /^[a-zA-Z\s0-9\-_]+$/;
    static general = /^.+$/;
    static generalEmpty = /^[.\n\t\s]*$/;
    static username = /^[a-zA-Z0-9_\-]{4,30}$/;
    static password = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,100}$/;
    static title = /^(?=.*[a-zA-Z])[a-zA-Z0-9:/\-_\s\?#]{1,100}$/;
    static commentName = /^[a-zA-Z0-9_\-'\s]*$/;
    static slug = /^[a-z0-9\-]{1,100}$/;
    static slugSection = /^[a-z0-9\-]{1,100}(\.[\d]+)?$/;
    static dateCreated = /^\d{4}\-\d{2}\-\d{2}$/;
    static email = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    static search = /[a-zA-Z0-9\-]+(\+[^a-zA-Z0-9\-]+)*/
    static dateTime = /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])\s+([0-2][0-9]):([0-5][0-9])$/
}