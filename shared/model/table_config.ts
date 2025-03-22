export class TableLabel {
    name?: string;
    column!: string;
    isHtml?: boolean;
}

export class TableFilters {
    title!: string;
    column!: string;
    value!: any;
    relationship!: 'le' | 'lt' | 'ge' | 'gt' | 'eq' | 'ne';
    active?: boolean;
}

export class TabAction {
    title!: string;
    callback!: Function;
    btnClass?: string;
    icon?: string;
    column?: string;
}

type EditFunction = (index: number, column: string, currentValue: string) => void;

export class TableConfig {
    labels!: TableLabel[];
    data!: any[];
    addNew?: Function;
    itemsPerPage!: number;
    actions?: TabAction[]
    filters?: TableFilters[];
    emptyMessage?: string;
    editableColumns?: string[];
    editFunction?: EditFunction;
    constructor(){
        this.itemsPerPage = 10;
    }
}