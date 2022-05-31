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
  // The todo array used to display the items. Subscribed via the async pipe
  todoList$ = this.todoService.todo$;

  // The selected todo item that we will edit. Subscribed via the async pipe
  selectedTodo$ = this.todoService.selectedTodo$;

  displayDialog = false;

  dialogMode = 'create';

  constructor(private todoService: TodoService) {}

  ngOnInit() {}

  /**
   * Used to show or hid the dialog
   * @param showDialog
   */
  toggleDialog(showDialog: boolean): void {
    this.displayDialog = showDialog;
  }

  /**
   * Open the dialog and set the mode to edit or create.
   * Specifies which mode the dialog should be set to.
   * This will update the selected todo item so it is passed to the dialog.
   * @param mode
   * @param todoId
   */
  openTodoDialog(mode: string, todoId: number | undefined = undefined): void {
    this.displayDialog = true;
    this.dialogMode = mode;

    if (todoId) {
      this.onSelectedTodoChanged(todoId);
    }
  }

  /**
   * Event handler for new todo items.
   * @param todo
   */
  onNewTodo(todo: Todo): void {
    this.todoService.newTodo(todo);
  }

  /**
   * Event handler for deleting todo items.
   * @param todo
   */
  onDeleteTodo(todo: Todo): void {
    this.todoService.deleteTodo(todo);
  }

  /**
   * Event handler for updating todo items.
   * @param todo
   */
  onEditTodo(todo: Todo): void {
    this.todoService.editTodo(todo);
  }

  /**
   * Event handler for updating the selected todo item to be edited.
   * @param todo
   */
  onSelectedTodoChanged(id: number) {
    this.todoService.selectedTodoChanged(id);
  }
}
