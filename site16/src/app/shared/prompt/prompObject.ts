import { Res } from "@shared/model/res";

export class SelectOption {
    name!: string;
    value!: string;
}
export class PromptObject {
    inputType!: 'text' | 'number' | 'password' | 'select' | 'checkbox' | 'textarea' | 'confirm' | 'file' | 'success' | 'primary' | 'warning' | 'danger'; //input type
    // confirm is on its own
    // danger, success, primary and warning are alert types
    // text, number and password are normal input types
    // checkbox is a checkbox input
    // file is a file input
    required?: boolean = false; // whether input is required or not
    closeButton?: boolean = true; // whether there is a close button to exit which does not trigger the callback
    callback?: Function = (res: Res) => { return null; } // non-required callback function
    maxlength?: number | null = null; // maxlength constraint
    maxFileSize?: number | null = null; // maxfilesize constraint in bytes
    AcceptFileFormat?: string[] | null = null; // AcceptFileFormat constraint eg image/* audio/mpeg et.c
    AcceptFileCategory?: string; // AcceptFileCategory constraint eg image, audio
    max?: number | null = null; // maxlength constraint
    min?: number | null = null; // maxlength constraint
    options?: SelectOption[] | null = null;
    rows?: number | null = null; // maxlength constraint
    minlength?: number | null = null; // maxlength constraint
    pattern?: RegExp | null = null; // in case there is a regex pattern
    errorMessage?: string | null = 'Please follow instructions'; //error message with a default value;
    checboxDesc?: string | null = null; //words beside checkbox;
    title!: string; // title to display
    instr?: string | null = null; //optional instruction
    cancelButton?: boolean = false;
    confirmButtons?: string[] = ['Yes', 'No'];
    id?: string;
    initVal?: any;
}
export class PromptObjectInput {
    inputType!: 'text' | 'number' | 'password' | 'textarea';
    required?: boolean = false;
    closeButton?: boolean = true;
    callback?: Function = (res: Res) => { return null; }
    maxlength?: number | null = null;
    max?: number | null = null;
    min?: number | null = null;
    rows?: number | null = null;
    minlength?: number | null = null;
    pattern?: RegExp | null = null;
    errorMessage?: string | null = null;
    title!: string;
    instr?: string | null = null;
    cancelButton?: boolean = false;
    initVal?: any;
}
export class PromptObjectSelect {
    inputType!: 'select';
    required?: boolean = false;
    closeButton?: boolean = true;
    callback?: Function = (res: Res) => { return null; }
    options!: SelectOption[] | null;
    errorMessage?: string | null = 'Please follow instructions';
    pattern?: RegExp | null = null;
    title!: string;
    instr?: string | null = null;
    cancelButton?: boolean = false;
}
export class PromptObjectFile {
    inputType!: 'file';
    required?: boolean = false;
    closeButton?: boolean = true;
    callback?: Function = (res: Res) => { return null; }
    maxFileSize!: number;
    AcceptFileFormat!: string[] ;
    AcceptFileCategory!: string;
    errorMessage?: string | null = 'Please follow instructions';
    title!: string;
    instr?: string | null = null;
    cancelButton?: boolean = false;
    pattern?: RegExp | null = null;
}
