import { Injectable } from '@angular/core';
import { concatMap, merge, Observable, of, scan, Subject } from 'rxjs';
import { Action } from '../shared/models/stream-actions';
import { Todo } from '../shared/models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todoSource$ = this.getTodos();

  private todoModifiedActionSubject = new Subject<Action<Todo>>();
  todoModifiedAction$ = this.todoModifiedActionSubject.asObservable();

  todo$ = merge(
    this.todoSource$,
    this.todoModifiedAction$.pipe(concatMap((todo) => this.saveTodo(todo)))
  ).pipe(
    scan(
      (acc, value) =>
        value instanceof Array ? [...value] : this.modifyStream(acc, value),
      [] as Todo[]
    )
  );

  constructor() {}

  /** Mock call to get Todo objects. */
  getTodos(): Observable<Todo[]> {
    const todoList: Todo[] = [
      { id: 1, title: 'Mow the lawn', createDate: new Date() },
      { id: 1, title: 'Walk the dog', createDate: new Date() },
      { id: 1, title: 'Wash the car', createDate: new Date() },
      { id: 1, title: 'Buy groceries', createDate: new Date() },
      { id: 1, title: 'Clean the house', createDate: new Date() },
    ];
    return of(todoList);
  }

  /** Mock call to save Todo objects. */
  saveTodo(todo: Action<Todo>): Observable<Action<Todo>> {
    return of(todo); // Make actual API call here
  }

  /**
   * Action<> objects let us perform CRUD actions to the todo array
   * @param {Todo[]} todo[] Todo list
   * @param {Todo} todo The todo to perform CRUD operations on
   * @returns The modified todo array
   */
  modifyStream(todoList: Todo[], operation: Action<Todo>): Todo[] {
    if (operation!.action === 'add') {
      return [...todoList, operation.item];
    } else if (operation.action === 'update') {
      return todoList.map((todo) =>
        todo.id === operation.item.id ? operation.item : todo
      );
    } else if (operation.action === 'delete') {
      return todoList.filter((todo) => todo.id !== operation.item.id);
    }
    return [...todoList];
  }
}
