[![CircleCI](https://circleci.com/gh/LD4P/sinopia_api.svg?style=svg)](https://circleci.com/gh/LD4P/sinopia_api)
[![Docker image](https://images.microbadger.com/badges/image/ld4p/sinopia_api.svg)](https://microbadger.com/images/ld4p/sinopia_api "Get your own image badge on microbadger.com")
[![OpenAPI Validator](http://validator.swagger.io/validator?url=https://raw.githubusercontent.com/LD4P/sinopia_api/main/openapi.yml)](http://validator.swagger.io/validator/debug?url=https://raw.githubusercontent.com/LD4P/sinopia_api/main/openapi.yml)
[![Docker Image Version (latest semver)](https://img.shields.io/docker/v/ld4p/sinopia_api?sort=semver)](https://hub.docker.com/repository/docker/ld4p/sinopia_api/tags?page=1&ordering=last_updated)

# Sinopia API

API for managing Sinopia resources atop the Mongo / AWS DocumentDB platform.

## Installation

### Prerequisites

* [node.js](https://nodejs.org/en/download/) JavaScript runtime (latest v16 version is recommended)
* [npm](https://www.npmjs.com/) JavaScript package manager
* [Docker](https://www.docker.com/)

You can use the ["n"](https://www.npmjs.com/package/n) node package management to manage multiple versions of node.

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

### Frameworks

Sinopia API uses Monk as the Mongo framework and Express as the HTTP framework:

- https://automattic.github.io/monk/
- https://expressjs.com/

### Linter for JavaScript

There are two linters/formatters used in this project: eslint and prettier.
They can be run together or individually.

To run both:
`npm run lint`

To auto-fix errors in both (where possible):
`npm run fix`

To run just eslint:
`npm run eslint`

To automatically fix just eslint problems (where possible):
`npm run eslint-fix`

To run just prettier:
`npm run pretty`

To automatically fix just prettier problems (where possible):
`npm run pretty-fix`

### Unit, feature, and integration tests

Tests are written with jest.

To run all of the tests:
`npm test`

To run a single test file (and see console messages):
`npx jest __tests__/endpoints/resourcePost.test.js`

To run a single test (and see console messages):
`npx jest __tests__/endpoints/resourcePost.test.js -t "returns 409 if resource is not unique"`

Or temporarily change the test description from `it("does something")` to `it.only("does something")` and run the single test file with `npx`.

### Connecting to the Mongo CLI

#### Localhost

`docker exec -it sinopia_api-mongo-1 mongo`

Note that it may be easier and more productive to use the mongo docker container from sinopia_editor (since it may have more data to work with).  In this case, spin up the mongo containers from sinopia_editor and the connect to that mongo instance (and leave it running with the local sinopia_api dev instance for testing in your browser):

```
# cd into the sinopia_editor folder
docker compose up -d mongo
docker exec -it sinopia_editor-mongo-1 mongo
```

#### Dev/Stage/Prod

You will first need to ssh to the AWS bastion host and then get to mongo from there.

1. Get the dev/stage/prod .pem file (ask other devs) and place at `~/.ssh/sinopia-aws-bastion.pem` on your laptop.
2. Use shared_configs https://github.com/sul-dlss/shared_configs/tree/sinopia-dev to get the values for the bastion host, the mongo host and the mongo password for the environment you are connecting to.  Note: the mongo info is labeled as "AWS DocumentDB".
3. `ssh -i ~/.ssh/sinopia-aws-bastion.pem ec2-user@<BASTION HOST>`
4. `mongo --host <MONGO HOST> --password <MONGO PASSWORD> --username sinopia --ssl --sslCAFile rds-combined-ca-bundle.pem`

#### Issuing queries

On the mongo CLI, the primary mongo database is called 'sinopia_repository', so an example below would fetch all of the users:

```
use sinopia_repository
db.users.find()
```

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

A JWT is used to make calls to sinopia_api in the context of a specific Cognito user (i.e. a user logged into Sinopia Editor). You can use the `bin/authenticate` command-line tool to authenticate to an AWS Cognito instance. This command will create a new file called `.cognitoToken` which contains a [JSON Web Token](https://jwt.io/), which you can use to authorize HTTP requests to the Sinopia API.

To authenticate:

```shell
$ AWS_PROFILE=name_of_aws_profile_used_in_~/.aws/config COGNITO_USER_POOL_ID=us-west-2_ABC123XYZ COGNITO_CLIENT_ID=abc123xyz456etc AWS_COGNITO_DOMAIN=https://sinopia-{ENV}.auth.us-west-2.amazoncognito.com bin/authenticate
```

The cognito user pool and client ID are available in the AWS Cognito Console for the specific environment (dev, stage or prod). The Client ID is under "App Client Settings" and the User Pool ID is under "General Settings". Possible {ENV} values in the cognito domain URL are "development", "staging" and "production".

You will need to enter your Cognito/Sinopia Editor username (usually SUNETID@stanford.edu) and password (note: it may not appear that there is a prompt after you execute the bin command).

**NOTE**: If you provide none of the above environment variables, `bin/authenticate` will default to the Sinopia development instance of Cognito and its sole user pool.

The JWT stored in `.cognitoToken` will be valid for approximately an hour.

#### Use JWT in HTTP Request

To use the JWT as stored in `.cognitoToken` to make authorized requests to Sinopia API, you can pass it along in the HTTP request as follows:

```shell
$ curl -i -H "Authorization: Bearer $(cat .cognitoToken)" http://localhost:3000/resource
```
