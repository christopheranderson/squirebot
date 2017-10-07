import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Location } from "@angular/common";

import "rxjs/add/operator/switchMap";

import { TasksService } from "../tasks.service";
import { ITask } from "../models/task";

enum EditState {
  clean,
  dirty,
  new,
  saving,
  saved,
  savefailure
}

@Component({
  selector: "app-task-detail",
  templateUrl: "./task-detail.component.html",
  styleUrls: ["./task-detail.component.css"]
})
export class TaskDetailComponent implements OnInit {
  task: ITask;
  isEditMode = false;
  editState = EditState.clean;

  constructor(private tasksService: TasksService,
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        if (params.get("id") === "new") {
          this.isEditMode = true;
          this.editState = EditState.new;
          return Promise.resolve({
            action: {
              type: "url",
              payload: {
                url: "",
                method: "POST"
              }
            },
            parameters: []
          } as ITask);
        } else {
          return this.tasksService.getTask(params.get("id"));
        }
      })
      .subscribe(task => this.task = task);
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  addParameter() {
    this.task.parameters.push({
      name: "",
      prompt: ""
    });
  }

  removeParameter(index) {
    this.task.parameters.splice(index, 1);
  }

  updateTask() {
    this.editState = EditState.saving;
    this.tasksService.updateTask(this.task).then((t) => {
      this.task.etag = t.etag;
      this.editState = EditState.saved;
    }).catch((err) => {
      console.log("Error updating task");
      this.editState = EditState.savefailure;
    });
  }

  cancelUpdate() {
    if (this.editState === EditState.new || this.editState === EditState.dirty) {
      const answer = confirm("Are you sure you want to cancel?");
      if (!answer) {
        return;
      }
    }
    this.editState = EditState.dirty;
    this.tasksService
      .getTask(this.task.id)
      .then(t => {
        this.task = t;
        this.editState = EditState.clean;
      }).catch((err) => {
        console.log("Error cleaning task");
      });
  }

  goBack(): void {
    this.location.back();
  }

}
