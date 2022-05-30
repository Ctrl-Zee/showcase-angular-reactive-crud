import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryTodoService } from './in-memory-todo.service';
import { TodoService } from './todo.service';
import { HttpClientModule } from '@angular/common/http';
import { GenericDataService } from './generic-data.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryTodoService),
  ],
  providers: [GenericDataService, TodoService],
})
export class CoreModule {}
