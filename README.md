# Maps Markers server
backend API for allowing these (view, create, edit and delete this markers) CRUD operations for markers.
## Concept
A user should be able to view, create, edit and delete this markers.
All the changes should be immediately visible on the map.

## Run The APP

#### Node is Needed
[Node.js](https://nodejs.org/en/)

#### Dependency manager
install `yarn` package manager globally
[Yarn](https://yarnpkg.com/lang/en/docs/install/)

#### Recommended IDE
[VSCode](https://code.visualstudio.com/)

#### Install `eslint` to follow code quality
[Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Clone the Repo
clone the repo `git clone git@github.com:runesam/maps-markers-server.git`

then navigate to the project root dir `cd maps-markers-server`

### server
- install dependencies via `yarn`
- init the client server via `yarn start`
  - default client server port is `5000`. if it is not available; the port can be changed in the `.env` file in root dir.
  
## open API
```$xslt
UNIQUE_QUERY=query
key=replaceMe
...
```
<b><i>please make sure that the `google api key`  is updated with real one in `.env` file</i></b>

## tasks
#### test (unit test with coverage report)
* test `yarn test`
* test watch `yarn test:watch`
#### flow (data type checker)
* flow `yarn flow`
* flow watch `yarn flow:watch`
#### build (bundle app to /dist dir)
* build `yarn build`

## third-party geoCoder API
The current geoCoder provider is `google API place`
https://developers.google.com/places/web-service/search

to replace with another provider; we need to change the following in `.env` file
*   GEO_URL
*   update the API_QUERIES to fit the new provider
*   update the UNIQUE_QUERY to fit the params that provider accepts as address value holder

ex.
##### http://newGeoProvider?secret=api_key&location=address_we_are_looking_for
then new `.env` file should look like
```
UNIQUE_QUERY=location
secret=SECRET_KEY_GOES_HERE
API_QUERIES=["location", "secret"]
GEO_URL=http://newGeoProvider
port=5000
```

also we need to update the `mapMarkers` method in `geo.module.js` as the received JSON from the new provider will differ from the current one.

## app APIs
#### 1. GET /user
`GET` `/user`

to retrieve the `google API key` and pre saved `markers`

```json
{
  "key": "googleApiKey",
  "markers": [
    { "lat": 52.4893823, "lng": 13.3468825, "id": "fe52a4af08d295850335a3b1828bcd18606e9195", "name": "Grunewaldstraße 33" },
    { "lat": 52.5248348, "lng": 13.3935123, "id": "df91979e54c63d340c26cfb261525ad5d84d7157", "name": "Oranienburger Str." }
  ]
}
```

#### 2. GET /geo/:address
`GET` `/geo/:address`
to retrieve the provided `address` 's geo location

ex. `/geo/grunewaldstr`
```json
[{
  "lat": 52.4893314,
  "lng": 13.3485329,
  "id": "43fb246548f0aa563120e12a3958b74cc8361d7c",
  "name": "Grunewaldstraße"
}]
```

#### 3. POST /markers
`POST` `/markers`
to add the provided `marker` to the user markers

ex. `/markers`
```
request body:
{
    "lat":30.5765383,
    "lng":31.5040656,
    "id":"b0bf2d8ba12b17b21dd64b3b41929fd2f5d3cc2f",
    "name":"Zagazig"
}
```
```
response body:
{
    "lat":30.5765383,
    "lng":31.5040656,
    "id":"b0bf2d8ba12b17b21dd64b3b41929fd2f5d3cc2f",
    "name":"Zagazig"
}
```

#### 4. PUT /markers
`PUT` `/markers`
to update the provided `marker` via old marker's id

ex. `/markers`
```
request body:
{
    "lat":31.791702,
    "lng":-7.092619999999999,
    "id":"844c9e34ccc9fad2714fc9d39c468eeea1a7442d",
    "name":"Morocco",
    "idToReplace":"df91979e54c63d340c26cfb261525ad5d84d7157"
}
```
```
response body:
{
    "lat":31.791702,
    "lng":-7.092619999999999,
    "id":"844c9e34ccc9fad2714fc9d39c468eeea1a7442d",
    "name":"Morocco",
    "idToReplace":"df91979e54c63d340c26cfb261525ad5d84d7157"
}
```

#### 5. DELETE /markers/:markerId
`DELETE` `/markers/:markerId`
to update the provided `marker` via old marker's id

ex. `/markers/844c9e34ccc9fad2714fc9d39c468eeea1a7442d`
```
response body:
{ "id":"844c9e34ccc9fad2714fc9d39c468eeea1a7442d" }
```

## Find in the App

### server
- Express
- babel-node
- jest
- flow
- eslint (air bnb preset)

## TODO
### code base
- current CRUD occurs over a basic JSON file (real DB to be implemented)
- integration test.
- better error handlers.
