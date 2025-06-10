# gill documentation

Documentation website for gill, built with [Fumadocs](https://github.com/fuma-nama/fumadocs).

## Install dependencies

Install using the `--ignore-workspace` flag to ensure the dependencies of the documentation website
are separate from the library dependencies.

```bash
pnpm install --ignore-workspace
```

## Run development server

```bash
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

## Generating the API references documentation

The docs have a `prebuild` command that will generate API docs (via TypeDoc) for the library's
packages.

> When working locally, it is not required to build these in order to test the local docs site.

You can manually trigger building the API references using the following command:

```shell
pnpm prebuild
```

## Learn more

To learn more about Next.js and Fumadocs, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.vercel.app) - learn about Fumadocs
