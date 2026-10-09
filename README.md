# PortfolioAngularApp

Portfolio website built with Angular 22, Angular Material, and Tailwind CSS 3.

## Setup

Use Node.js 24.19.0 (specified in `.nvmrc`), then install the dependencies:

```sh
nvm use
npm ci
```

Angular 22 requires Node.js `^22.22.3 || ^24.15.0 || >=26.0.0` and TypeScript 6.0. See the [Angular version compatibility guide](https://angular.dev/reference/versions).

Tailwind stays on the latest 3.4 release because the existing styles use Sass and Angular Material's Sass theming API. Tailwind 4 requires a separate migration to its CSS build workflow.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

The development configuration externalizes the unused `marked-katex-extension` import to work around [ngx-markdown's optional KaTeX import issue](https://github.com/jfcere/ngx-markdown/issues/681). If KaTeX is enabled later, install its dependencies and remove this external import configuration.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to validate and generate the content data, routes, and sitemap, then build and prerender the project. The build artifacts will be stored in the `dist/` directory.

Run `npm run serve:ssr:portfolio-angular-app` to serve the built application with Express. SSR allows the portfolio domain and local development hosts. For another SSR hostname, set Angular's `NG_ALLOWED_HOSTS` environment variable to a comma-separated list of allowed hosts.

## Running unit tests

Run `npm test` to execute the unit tests in headless Chrome via [Karma](https://karma-runner.github.io). Run `npm run test-browser` for interactive tests.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
