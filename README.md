# Angular 11 Virtual Scroll

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.



## Angular - Exercise Description

We’d like you to write a web application to view a large list of transactions on the Tezos blockchain. The application must use the latest version of Angular and the tzstats explorer API. 

The web application must retrieve and display existing transactions in the table using virtual scroll and reactive state management library.

The user must be able to view and scroll through the entire transaction history. Data must be loaded dynamically by using this API:

https://api.tzstats.com/tables/op?columns=row_id,time,type,sender,volume&receiver=tz1gfArv665EUkSg2ojMBzcbfwuPxAvqPvjo&type=transaction&limit=10

Please display only 10 items in the table ( limit = 10 )  and use the cursor to dynamically load older data ( cursor ). For more info, please see 

https://tzstats.com/docs/api/index.html#operation-table

Here is an example: 
https://api.tzstats.com/tables/op?columns=row_id,time,type,sender,volume&receiver=tz1gfArv665EUkSg2ojMBzcbfwuPxAvqPvjo&type=transaction&limit=10&cursor.lte=18990092

Please ensure that the style of the table resembles the picture below as much as possible. 

![](/table-example.png)

### Please develop your solution focusing on the following aspects:

●	The solution must be available as a Git repository which can be accessed by the solution reviewers.

●	The solution reviewers must be able to build the project for deployment and testing. 

●	A short README file in the root of the project must explain how to build, test and run the application.

●	The programming language must be Typescript.

●	Both the project itself and its code must be reasonably structured.

●	The project must contain some unit tests and at least one end-to-end test for a selected frontend feature.

●	The web application must resemble the provided table design as much as possible

●	The web application must use a reactive state management library ngrx/store https://ngrx.io/guide/store.

●	The web application must use an angular material scrolling component https://material.angular.io/cdk/scrolling/overview.

