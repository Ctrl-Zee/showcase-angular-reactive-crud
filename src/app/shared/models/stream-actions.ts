type ActionType = 'add' | 'update' | 'delete';

/**
 * Action<T> is a wrapper for any entity that supports editing.
 * By using the wrapper we can specify the action we want to perform on the entity.
 * We can use this in our functions used to call our observable/subject and set the the action we want to perform
 *
 * Example:
 * private userModifiedActionSubject = new Subject<Action<User>>();
 * userModifiedAction$ = this.userModifiedActionSubject.asObservable();
 * pushNewUser(user: User): void {
 *   this.userModifiedActionSubject.next({ item: user, action: 'add' });
 * }
 * In the example above we have a subject and an observable derived from the subject.
 * The observable can be merged with another observable stream and used to perform edit actions.
 * Inside pushNewUser() we are calling the next method and passing an Action<User> object that we create.
 * This is where you would change the action accordingly
 */
export interface Action<T> {
  item: T;
  action: ActionType;
}
