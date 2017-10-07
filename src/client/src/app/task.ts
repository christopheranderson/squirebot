export interface ITask {
    name: string;
    action: IAction;
    parameters: IParameter[];
}

export interface IAction {
    type: string;
    url: string;
    method: string;
}

export interface IParameter {
    prompt: string;
    name: string;
}