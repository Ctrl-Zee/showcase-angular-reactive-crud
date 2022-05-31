# Angular Reactive CRUD

Simple todo application that demonstrates how to write reactive code with CRUD operations. Inspiried by Deborah Kurata's [Angular-RxJs](https://github.com/DeborahK/Angular-RxJS/tree/master/APM-WithExtras) course.

## Overview

To better understand how this app uses reactive practices to implement CRUD operations we need to understand how the data flows.

I like to architect my applications where the data starts in the services and flows down into parent components where it is subscribed to using the async pipe. The child components are dumb/presentational components which only communicate with input/output decorators.

When we need to perform CRUD operations we can call functions in the service that update our data streams which in turn emit data back down to the components.

Our components use the `On Push`change detection strategy since our data streams emit new observables to the components.

## Running the app

Open the console and run `npm install`

## Development server

Run `ng serve -o` for a dev server. The app will automatically reload if you change any of the source files.
