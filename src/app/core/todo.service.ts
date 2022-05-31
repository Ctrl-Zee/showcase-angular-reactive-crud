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
} from 'rxjs';
import { Action } from '../shared/models/stream-actions';
import { Todo } from '../shared/models/todo';
import { GenericDataService } from './generic-data.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todoSource$ = this.getTodos();

  // Use private subjects/behavior subjects and expose them as observables.
  // We expose the next function in a function so that there is only one place the next function is called.
  private todoModifiedActionSubject = new Subject<Action<Todo>>();
  todoModifiedAction$ = this.todoModifiedActionSubject.asObservable();

  // The todo stream used to display the todo list.
  // We merge the todos from the API with the action stream which allows us to do CRUD operations
  // The action stream updated the API via processAction() and then creates and buffers a new array of products with scan.
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

  // Responsible for getting the currently selected todo item.
  // This is passed to the todo dialog to allow editing the todo item.
  private selectedTodoSubject = new Subject<number>();
  selectedTodoChanged$ = this.selectedTodoSubject.asObservable();
  selectedTodo$ = this.selectedTodoChanged$.pipe(
    switchMap((id) => {
      return this.getTodoById(id);
    })
  );

  constructor(private genericDataService: GenericDataService) {}

  /**
   * Calls API to get todo items
   * @returns  Array of todo items
   */
  getTodos(): Observable<Todo[]> {
    return this.genericDataService.list<Todo[]>('todoList');
  }

  /**
   * Call the API to get a todo item by id.
   * @param {number} Id  Id of the todo item to get
   * @returns The todo item based on id
   */
  getTodoById(id: number): Observable<Todo> {
    return this.genericDataService.read<Todo>('todoList', id);
  }

  /**
   * Syncs the todo list with the list returned from the API.
   * This will perform CRUD operations on the data via the API to keep the data in the DB in sync.
   * @param {Action} action  Action generic with Todo item
   * @returns The Action generic with todo item
   */
  processAction(action: Action<Todo>): Observable<Action<Todo>> {
    switch (action.action) {
      case 'add':
        return this.genericDataService
          .post<Todo>('todoList', action.item)
          .pipe(map((todo) => ({ item: todo, action: 'add' } as Action<Todo>)));
      case 'update':
        return this.genericDataService
          .update<Todo>('todoList', action.item)
          .pipe(
            map(() => ({ item: action.item, action: 'update' } as Action<Todo>))
          );
      case 'delete':
        return this.genericDataService
          .delete<Todo>('todoList', action.item.id ?? -1)
          .pipe(
            map(() => ({ item: action.item, action: 'delete' } as Action<Todo>))
          );
      default:
        return of(action);
    }
  }

  /**
   * Action<> objects let us perform CRUD actions to the todo stream.
   * This stream is what is used to display the list of todo items
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

  /**
   * Call this function to emit new items to the stream
   * @param {Todo} todo
   */
  newTodo(todo: Todo): void {
    this.todoModifiedActionSubject.next({ item: todo, action: 'add' });
  }

  /**
   * Call this function to edit an item and update the stream
   * @param {Todo} todo
   */
  editTodo(todo: Todo): void {
    this.todoModifiedActionSubject.next({ item: todo, action: 'update' });
  }

  /**
   * Call this function to remove and item from the stream
   * @param {Todo} todo
   */
  deleteTodo(todo: Todo): void {
    this.todoModifiedActionSubject.next({ item: todo, action: 'delete' });
  }

  /**
   * Call this function to emit the newly selected todo item.
   * @param {number} id
   */
  selectedTodoChanged(id: number) {
    this.selectedTodoSubject.next(id);
  }
}
