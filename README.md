# api-docs-aggregator

The 'api-docs' project is about giving your IT company the capability to see all internal api's swagger documentation.

This Project aims to utilize Consul to help solve this problem. Allowing, us to simply set a standard by setting a path on all services to contain a `/api-docs/swagger.json` endpoint within your team's service.

This service uses Consul's event stream API: We configure this by adding a block of code in our Consul Configuration.

```https://www.consul.io/docs/agent/watches.html ```

### Consumed Consul Tooling endpoints below:

```https://www.consul.io/api/catalog.html```
```
GET

1. /catalog/services

2. /catalog/service/your-api
```

### 1. We use to grab all services
### 2. Using each service we retrieve the listening transfer protocal port

## Internal Service Endpoints

1. GET index
2. GET write

## *** Node v10 ***

## Local Development
1. `npm install`
2.  set up your .env file with appropriate ENV variables
3. `npm run dev`
4. test on localhost:3000/index
5. test on localhost:4200/write

## Local Testing
1. `docker-compose up`
2.  test on localhost:4200/index
3.  test on localhost:4200/write

## Run Unit Tests
1. `npm install`
2. `npm run tests`

## Automated deployment [ .gitlab-ci.yml ]

1. Release commands from package.json v0.0.1
* `npm run release:patch` , `npm run release:minor` , `npm run release:major`
* Please note that these commands will run in the release.sh script
  1. Check your local branch is ```master```
  2. Check branch is in "clean state"
  4. Update marathon.json version number ```updateMarathonJson.js```
  5. Create git tag and push to master
3. The git tag created will then trigger the .gitlab-ci.yml
* This will start the pipeline

### Pipeline: Two Stages
1. Build
2. Deploy

* package.json

```
{
  "name": "api-docs-aggregator",
  "version": "0.0.1",
  "description": "Internal Swagger Documentation",
...
 }
```
* marathon.json


2. tag from master with tag name = version number e.g. 1.0.41

## Manual deployment

1. Build docker container

` docker build --no-cache --force-rm -t your repo . `

2. Make sure the container runs without npm errors. Test local.

3. Publish the container to artifactory

` docker push TODO ADD YOUR REPO`

4. Update version number in marathon.json and in meta/manifest.json

5. Deploy to marathon by running the manual deploy script

`./deploy.sh`

6. Observe deployment status in marathon

7. Observe logs in graylog
`TODO ADD YOUR REPO`
- Search with -> image_name: api-docs_web

# Author

Stephen Schatzl




