import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/core/todo.service';
import { Todo } from 'src/app/shared/models/todo';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit {
  todoList$ = this.todoService.todo$;
  selectedTodo$ = this.todoService.selectedTodo$;
  displayDialog = false;
  dialogMode = 'create';

  constructor(private todoService: TodoService) {}

  ngOnInit() {}

  toggleDialog(showDialog: boolean): void {
    this.displayDialog = showDialog;
  }

  openTodoDialog(mode: string, todoId: number | undefined = undefined): void {
    this.displayDialog = true;
    this.dialogMode = mode;

    if (todoId) {
      this.onSelectedTodoChanged(todoId);
    }
  }

  onNewTodo(todo: Todo): void {
    this.todoService.newTodo(todo);
  }

  onDeleteTodo(todo: Todo): void {
    this.todoService.deleteTodo(todo);
  }

  onEditTodo(todo: Todo): void {
    this.todoService.editTodo(todo);
  }

  onSelectedTodoChanged(id: number) {
    this.todoService.selectedTodoChanged(id);
  }
}
