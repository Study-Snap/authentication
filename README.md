<p align="center">
  <a href="#" target="blank"><img src="./.github/docs/media/studysnap.png" width="320" alt="StudySnap Logo" /></a>
</p>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
![Build and Push Docker](https://github.com/Study-Snap/authentication/workflows/Build%20and%20Push%20Docker/badge.svg)
![Lint and Scan Docker](https://github.com/Study-Snap/authentication/workflows/Lint%20and%20Scan%20Docker/badge.svg)
![E2E and Coverage](https://github.com/Study-Snap/authentication/workflows/E2E%20and%20Coverage/badge.svg)
![Unit Tests](https://github.com/Study-Snap/authentication/workflows/Unit%20Tests/badge.svg)
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](/LICENSE)

</div>

---

<p align="center">Authentication Backend for the StudySnap application</p>
    <p align="center">

## Description

The authentication backend for StudySnap created using the [NestJS](http://nestjs.com) framework. Leverages [Passport](http://www.passportjs.org) for use of custom authentication strategies and JWT token signing.

## Prerequisites

This project has a few extra requirements in order to function properly.

- Connection to an existing(or new) PostgreSQL database (configured through docker). This is where we would like to store users and active refresh tokens.
- **Preferrably** [Docker](http://docker.com) and/or [docker-compose](https://docs.docker.com/compose/). Note: Can be run without docker.
- Configured `.env` or `exported` environment variables according to the available configurations listed below.

## Available Configurations

Below is a list of available configuration options to customize the project. **Note:** These configuration options are available to be individually configured as per your environment (`development`, `test`, and `production`)

| Option                  | Description                                                                                              | Default                   | Optional |
|-------------------------|----------------------------------------------------------------------------------------------------------|---------------------------|----------|
| PORT             | Defines the port for the API to listen on                                                                | `5555`                    | Y        |
| MAX_REQUESTS            | Defines the maximum number of requests per 15 minutes (rate limiting)                                    | `250`                    | Y        |
| BCRYPT_SALT_ROUNDS           | Specifies the number of salt rounds to apply to password hashes using [bcrypt](https://www.npmjs.com/package/bcrypt) | `12` | Y        |
| DB_DIALECT       | Specifies the type of database you wish to use in your implementation. Thanks to NestJS, this is optional, however there will be some limited extra setup required for anything other than `postgreSQL` | `postgres`                      | Y        |
| DB_HOST                | Specifies the database host address (IP or Domain) to reach the database                                | `localhost`               | N        |
| DB_PORT                | Specifies the port to reach the database host application                                                                    | `5432`                    | Y        |
| DB_USER                | The database user to authenticate to the database host                                                    | `NONE`                     | N        |
| DB_PASS            | The password to authenticate `$DB_USER`                                                             | `NONE`                     | N        |
| DB_USER_DATABASE       | The name of the application database where you will store your users.                                                 | `studysnap_db`               | Y        |
| DB_RETRY_ATTEMPTS             | Number of times to retry a failed connection to the database configured.                                                                              | `2`                   | Y        |
| JWT_SECRET      | Used to cryptographically sign/decode authentication (JWT) tokens sent/recieved from the authentication/authorization server.                                                                              | `NONE`                     | N        |
| JWT_ACCESS_TOKEN_EXPIRE_TIME | Specifies the time it takes for an access token to expire. (in `production` it is recommended this be a short-lived token to limit risk of compromised tokens causing damange) | `10m`                       | Y        |

> The current dev environment setup I have convieniently included in the `.env` file at the root of this project.

## Running the app

You can choose to run this project in multiple ways depending on what you need.

### Extra Steps

Currently there is one additional setup command you will need to run before running the app in Docker or Standalone. You must have postgreSQL installed and configured properly (as per **prerequisites** above). Do this with Docker (**recommended**).

```bash

# Usable with default configuration
$ docker run -d \
    -e POSTGRES_DB=studysnap_db \
    -e POSTGRES_USER=studysnap \
    -e POSTGRES_PASSWORD=snapstudy \
    -p 5432:5432 \
    postgres:13.1

```

> Make sure that you change the passed environment variables if your needs change.

### Docker (recommended)

From the project root, run the following.

```bash
# Run from published image
$ docker run -d -p 5555:5555 <other_options> studysnap/authentication:<version_tag>

# Build & Run Locally
$ docker build -t local/studysnap-authentication:latest .
$ docker run -d -p 5555:5555 <other_options> local/studysnap-authentication:latest

```

### Standalone / Development

Install the required project dependencies

```bash
$ npm install
```

Run the project

```bash
# development
$ npm run start

# development with watch mode (recommended)
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

We are currently using Helm to handle our deployment to our K8s Cluster. To manually deploy, we need to execute the following commands.

```bash

# Add the studysnap helm repository & Update
helm repo add studysnap https://study-snap.github.io/charts/
helm repo update

# Now install the authentication chart from the repository
helm install authentication studysnap/authentication [optional_flags]

```

> I personally recommend using [k8s Lens](http://k8slens.dev) to help visualize the deployment on the cluster

## Support

Create an **issue** in the StudySnap [Jira](http://studysnap.atlassian.net)

## Authors

- [Benjamin Sykes](https://sykesdev.ca)
- [Liam Stickney](https://github.com/LiamStickney)
- [Malik Sheharyaar Talhat](https://github.com/orgs/Study-Snap/people/maliksheharyaar)

## License

StudySnap is [Apache licensed](LICENSE).
