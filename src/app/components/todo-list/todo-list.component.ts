import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/core/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  todoList$ = this.todoService.todo$;
  displayDialog = false;

  constructor(private todoService: TodoService) {}

  ngOnInit() {}

  toggleDialog(): void {
    this.displayDialog = true;
  }
}
