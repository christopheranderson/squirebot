export interface ITask {
    id?: string;
    etag?: string;
    lastUpdated?: number;
    title?: string;
    description?: string;
    action?: ITaskAction;
    parameters?: ITaskParameter[];
}

export interface ITaskAction {
    type: string;
    payload: { [label: string]: string };
}

export interface ITaskParameter {
    prompt: string;
    name: string;
}

