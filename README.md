<p align="center">
  <a href="http://flowsync.io/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A user friendly project management tool <a href="http://flowsync.io" target="_blank">Flowsync</a>, for teams that want to be efficient and productive.</p>

## Description

This is the repository for the backend side of FlowSync using NestJs.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Set up your database

Create `.env` file with `DATABASE_URL` and `SEED_EMAIL` which is the email you will use for creating an account in FlowSync.

```bash
# push the schema
$ pnpm prisma db push

# seed you db
$ pnpm prisma db seed
```

## View all the endpoints when server is running

Assuming you set the `PORT` in your `.env` to `4040` or leave it unspecified

<a href="http://localhost:4040/api#/">http://localhost:4040/api#/</a>

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Development rules, tips and tricks

1. Controller must be named in singular. E.g. dogs ❌ dog ✅

2. Use Nest CLI! Powerful tool that saves time and adheres to our repo structure.

```bash
# Global Nest CLI installation
$ pnpm install -g @nestjs/cli

# To create a dog controller with the service and module
$ pnpm nest g resource dog
```

... being constantly updated

## License

Nest is [MIT licensed](LICENSE).
