import { Injectable, isDevMode } from "@angular/core";

import { environment } from "../environments/environment";
import { ITask } from "./models/task";
import { tasks } from "./models/MOCK_TASKS";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class TasksService {
  baseUrl = environment.baseUrl || "";

  constructor(private http: HttpClient) { }

  getTasks(): Promise<ITask[]> {
    if (environment.mocked) {
      return Promise.resolve(tasks);
    } else {
      const p: Promise<ITask[]> = new Promise((res, rej) => {
        this.http
          .get(`${this.baseUrl}/api/tasks`)
          .subscribe(data => {
            res(data as ITask[]);
          }, (err) => {
            if (err.error instanceof Error) {
              rej(err);
            } else {
              if (err.status === 0) {
                if (isDevMode()) {
                  alert("Could not connect to host, might need to enable CORS or make sure it is up and running...");
                }
              }
              rej(new Error(`Bad response: status: ${err.status}, body: ${JSON.stringify(err.error, null, " ")}`));
            }
          });
      });
      return p;
    }
  }

  getTask(id: string): Promise<ITask> {
    if (environment.mocked) {
      return Promise.resolve(tasks.find(task => task.id === id));
    } else {
      const p: Promise<ITask> = new Promise((res, rej) => {
        this.http
          .get(`${this.baseUrl}/api/tasks/${id}`)
          .subscribe(data => {
            res(data as ITask);
          }, (err) => {
            if (err.error instanceof Error) {
              rej(err);
            } else {
              rej(new Error(`Bad response: status: ${err.status}, body: ${JSON.stringify(err.error, null, " ")}`));
            }
          });
      });
      return p;
    }
  }

  updateTask(task: ITask): Promise<ITask> {
    if (environment.mocked) {
      const i = tasks.findIndex(t => t.id === task.id);
      tasks[i] = task;
      return Promise.resolve(tasks[i]);
    } else {
      const p: Promise<ITask> = new Promise((res, rej) => {
        let url = `${this.baseUrl}/api/tasks/${task.id}`;
        if (!task.id) {
          url = `${this.baseUrl}/api/tasks/`;
        }
        this.http
          .post(url, task)
          .subscribe(data => {
            res(data as ITask); // will only have id and etag on it
          }, (err) => {
            if (err.error instanceof Error) {
              rej(err);
            } else {
              rej(new Error(`Bad response: status: ${err.status}, body: ${JSON.stringify(err.error, null, " ")}`));
            }
          });
      });
      return p;
    }
  }

}
