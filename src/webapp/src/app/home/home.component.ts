import { Component, OnInit } from "@angular/core";
import { TasksService } from "../tasks.service";
import { ITask } from "../models/task";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

  tasks: ITask[] = [];

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.tasksService.getTasks().then(tasks => this.tasks = tasks);
  }

  createTask() {
    console.log("Create task called");
  }
}
