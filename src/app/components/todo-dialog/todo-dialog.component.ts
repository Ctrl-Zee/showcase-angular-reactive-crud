import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Todo } from 'src/app/shared/models/todo';

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoDialogComponent implements OnInit, OnChanges {
  @Input() mode!: string;
  @Input() selectedTodo!: Todo | null;
  @Output() newTodoEvent = new EventEmitter<Todo>();
  @Output() updateTodoEvent = new EventEmitter<Todo>();
  @Output() closeDialogEvent = new EventEmitter<boolean>();

  todoForm!: FormGroup;

  // Holds the title and button text for each mode
  customTextsByMode = new Map<string, any>([
    ['edit', { title: 'Edit Todo', buttonName: 'Edit' }],
    ['create', { title: 'Add Todo', buttonName: 'Save' }],
  ]);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.todoForm = this.formBuilder.group({
      title: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if a new todo item was passed in to be edited and populate the input.
    if (changes['selectedTodo']?.currentValue && this.mode === 'edit') {
      this.todoForm.controls['title'].setValue(this.selectedTodo?.title);
    }
  }

  /** Controls which save function is called */
  submit(): void {
    if (this.mode === 'edit') {
      this.updateTodo();
    } else {
      this.saveTodo();
    }
  }

  /** Create a new todo item from the form and emit to the parent */
  saveTodo(): void {
    const todo: Todo = {
      title: this.todoForm.controls['title'].value || null,
      createDate: new Date(),
    };

    this.newTodoEvent.emit(todo);
    this.closeAndReset();
  }

  /** Create a new todo item from the form and emit to the parent */
  updateTodo(): void {
    const todo: Todo = {
      id: this.selectedTodo?.id,
      title: this.todoForm.controls['title'].value || null,
      createDate: new Date(),
    };

    this.updateTodoEvent.emit(todo);
    this.closeAndReset();
  }

  /** Clean up form and emit event to close dialog */
  closeAndReset(): void {
    this.todoForm.reset();
    this.closeDialogEvent.emit(false);
  }

  /** Helper function to get the dialog title to display */
  get title(): string {
    return this.customTextsByMode.get(this.mode).title;
  }

  /** Helper function to get the button text to display */
  get buttonName(): string {
    return this.customTextsByMode.get(this.mode).buttonName;
  }
}
