[![CircleCI](https://circleci.com/gh/LD4P/sinopia_api.svg?style=svg)](https://circleci.com/gh/LD4P/sinopia_api)
[![Docker image](https://images.microbadger.com/badges/image/ld4p/sinopia_api.svg)](https://microbadger.com/images/ld4p/sinopia_api "Get your own image badge on microbadger.com")
[![OpenAPI Validator](http://validator.swagger.io/validator?url=https://raw.githubusercontent.com/LD4P/sinopia_api/main/openapi.yml)](http://validator.swagger.io/validator/debug?url=https://raw.githubusercontent.com/LD4P/sinopia_api/main/openapi.yml)

# Sinopia API

API for managing Sinopia resources atop the Mongo / AWS DocumentDB platform.

## Installation

### Prerequisites

* [node.js](https://nodejs.org/en/download/) JavaScript runtime (>=14 is recommended)
* [npm](https://www.npmjs.com/) JavaScript package manager
* [Docker](https://www.docker.com/)

You can use the ["n"](https://www.npmjs.com/package/n) node package management to manage multiple version of node.

### Installation instructions

1.  Run `npm init`, and follow the instructions that appear.
2.  Get latest npm: `npm install -g npm@latest`
3.  Run `npm install`. This installs everything needed for the build to run successfully.
4.  Run `docker-compose pull` to pull down all images.

## Running the application
To start all of the supporting services (Mongo, etc.):
`docker-compose up -d`

To start the Express web server and run the application at [http://localhost:3000](http://localhost:3000):
`npm run dev-start`

This is in development mode and code changes will immediately be loaded without having to restart the server.

If you are working on the MARC endpoints, supply the AWS credentials:
`AWS_ACCESS_KEY_ID=AKIAWCX4L27WVC12345 AWS_SECRET_ACCESS_KEY=eSxHrLXdBUZSVNWvRLaOdq771rtgoj1i12345 npm run dev-start`

## Developers

### Linter for JavaScript
To run eslint:
`npm run eslint`

To automatically fix problems (where possible):
`npm run eslint-fix`

### Monitoring Mongo
Mongo Express is available for monitoring local Mongo at http://localhost:8082.

### Copying resources from one environment to another
```
bin/copy https://api.development.sinopia.io http://localhost:3000
```

Copies can also be limited by providing a querystring supported by the `/resource` endpoint.
```
bin/copy https://api.development.sinopia.io http://localhost:3000 group=stanford
```

Or a single resource can be copied:
```
bin/copySingle https://api.development.sinopia.io/resource/a20ab8a5-397d-48db-a0a2-6a7bfe04d8f6 http://localhost:3000
```

### Get a JWT

You can use the `bin/authenticate` command-line tool to authenticate to an AWS Cognito instance. This command will create a new file called `.cognitoToken` which contains a [JSON Web Token](https://jwt.io/), which you can use to authorize HTTP requests to the Sinopia API.

To authenticate:

```shell
$ AWS_PROFILE=name_of_aws_profile_used_in_~/.aws/config_file COGNITO_USER_POOL_ID=us-west-2_ABC123XYZ COGNITO_CLIENT_ID=abc123xyz456etc AWS_COGNITO_DOMAIN=https://sinopia-{ENV}.auth.us-west-2.amazoncognito.com bin/authenticate
```

**NOTE**: If you provide none of the above environment variables, `bin/authenticate` will default to the Sinopia development instance of Cognito and its sole user pool.

The JWT stored in `.cognitoToken` will be valid for approximately an hour.

#### Use JWT in HTTP Request

To use the JWT as stored in `.cognitoToken` to make authorized requests to Sinopia API, you can pass it along in the HTTP request as follows:

```shell
$ curl -i -H "Authorization: Bearer $(cat .cognitoToken)" http://localhost:3000/resource
```
