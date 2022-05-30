import { Injectable } from '@angular/core';
import {
  concatMap,
  map,
  merge,
  Observable,
  of,
  scan,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Action } from '../shared/models/stream-actions';
import { Todo } from '../shared/models/todo';
import { GenericDataService } from './generic-data.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todoSource$ = this.getTodos();

  private todoModifiedActionSubject = new Subject<Action<Todo>>();
  todoModifiedAction$ = this.todoModifiedActionSubject.asObservable();
  todo$ = merge(
    this.todoSource$,
    this.todoModifiedAction$.pipe(concatMap((todo) => this.processAction(todo)))
  ).pipe(
    scan(
      (acc, value) =>
        value instanceof Array ? [...value] : this.modifyStream(acc, value),
      [] as Todo[]
    )
  );

  private selectedTodoSubject = new Subject<number>();
  selectedTodoChanged$ = this.selectedTodoSubject.asObservable();
  selectedTodo$ = this.selectedTodoChanged$.pipe(
    switchMap((id) => {
      return this.getTodoById(id);
    })
  );

  constructor(private genericDataService: GenericDataService) {}

  getTodos(): Observable<Todo[]> {
    return this.genericDataService.list<Todo[]>('todoList');
  }

  getTodoById(id: number): Observable<Todo> {
    return this.genericDataService.read<Todo>('todoList', id);
  }

  /** Updates the API with the new todo item */
  processAction(action: Action<Todo>): Observable<Action<Todo>> {
    switch (action.action) {
      case 'add':
        return this.genericDataService
          .post<Todo>('todoList', action.item)
          .pipe(map((todo) => ({ item: todo, action: 'add' } as Action<Todo>)));
      case 'update':
        this.genericDataService.update<Todo>('todoList', action.item);
        return of(action); // the in memory data update call doesn't return the updated object so we are manually returning it.
      case 'delete':
        this.genericDataService.delete<Todo>('todoList', action.item.id ?? -1);
        return of(action); // the in memory data delete call doesn't return the deleted object so we are manually returning it.
      default:
        return of({} as Action<Todo>);
    }
  }

  /**
   * Action<> objects let us perform CRUD actions to the todo array
   * @param {Todo[]} todo[] Todo list
   * @param {Todo} todo The todo to perform CRUD operations on
   * @returns The modified todo array
   */
  modifyStream(todoList: Todo[], operation: Action<Todo>): Todo[] {
    if (operation?.action === 'add') {
      return [...todoList, operation.item];
    } else if (operation?.action === 'update') {
      return todoList.map((todo) =>
        todo.id === operation.item.id ? operation.item : todo
      );
    } else if (operation?.action === 'delete') {
      return todoList.filter((todo) => todo.id !== operation.item.id);
    }
    return [...todoList];
  }

  newTodo(todo: Todo): void {
    this.todoModifiedActionSubject.next({ item: todo, action: 'add' });
  }

  editTodo(todo: Todo): void {
    this.todoModifiedActionSubject.next({ item: todo, action: 'update' });
  }

  deleteTodo(todo: Todo): void {
    this.todoModifiedActionSubject.next({ item: todo, action: 'delete' });
  }

  selectedTodoChanged(id: number) {
    this.selectedTodoSubject.next(id);
  }
}
