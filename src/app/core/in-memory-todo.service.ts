import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Todo } from '../shared/models/todo';

@Injectable({
  providedIn: 'root',
})
export class InMemoryTodoService extends InMemoryDbService {
  createDb(): { todoList: Todo[] } {
    return {
      todoList: [
        { id: 1, title: 'Mow the lawn', createDate: new Date() },
        { id: 2, title: 'Walk the dog', createDate: new Date() },
        { id: 3, title: 'Wash the car', createDate: new Date() },
        { id: 4, title: 'Buy groceries', createDate: new Date() },
        { id: 5, title: 'Clean the house', createDate: new Date() },
      ],
    };
  }

  // Overrides the genId method to ensure that a todo always has an id.
  genId(todo: Todo[]): number {
    return todo.length > 0
      ? Math.max(...todo.map((todo) => todo.id ?? 0)) + 1
      : 6;
  }
}
