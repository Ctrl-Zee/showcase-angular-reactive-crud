/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InMemoryTodoService } from './in-memory-todo.service';

describe('Service: InMemoryTodo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InMemoryTodoService]
    });
  });

  it('should ...', inject([InMemoryTodoService], (service: InMemoryTodoService) => {
    expect(service).toBeTruthy();
  }));
});
