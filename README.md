# Aura Code Challenge

This challenge will allow you demostrate your knowledge and understanding of node.js.
It is intended to be familar, much like a development story that could come up on the job.
After you submit the completed project, we will schedule a follow-up code-review.

## The Solution

This implementation leverages the [jspath](https://www.npmjs.com/package/jspath) package for parsing and executing queries.  It exposes
the full `Object predicates` syntax which is documented [here](https://www.npmjs.com/package/jspath#object-predicates).

## Known issues

This solution lacks the ability to find the closest latitude/longitude and instead allows you to
define a bounding box for location that will return all zip codes within the box.

### Sample Event

```json
{
  "httpMethod": "GET",
  "path": "/",
  "headers": {},
  "queryStringParameters": {
    "query": ".estimated_population > 14000 && .estimated_population < 15000 && .state == \"ME\""
  }
}
```

## The Story

**Create a lambda-like handler function that can query zip code data in various ways**

- handler function is already bootstrapped in `src/index.js`
- handler is invoked with events (see below) as would come from API Gateway
- it is `async` and should return an array or throw an error
- the dataset to be searched is included in the `src/data.json` file
- look at the data and decide how best to utilize it

### Acceptance Criteria

- design and define zipcode api
- implement zipcode api handler
- search by full or partial zipcode
- search by full or partial city name
- search by closest latitude/longitude
- filter by additional attributes

### Sample Zipcode Object

```json
{
  "zip": "01230",
  "type": "STANDARD",
  "primary_city": "Great Barrington",
  "acceptable_cities": "Egremont, Gt Barrington, N Egremont, New Marlboro, New Marlborou, New Marlborough, North Egremont, Simons Rock",
  "unacceptable_cities": "Alford, Berkshire Heights, Hartsville, Risingdale, Van Deusenville",
  "state": "MA",
  "county": "Berkshire County",
  "timezone": "America/New_York",
  "area_codes": "413",
  "latitude": "42.19",
  "longitude": "-73.35",
  "country": "US",
  "estimated_population": "5873"
}
```

## Suggestions

- Spend as much or as little time as you wish on this challenge.
- Many implementation details are up to you, be prepared to explain your decisions.
- Details matter, but you should strive to provide a complete feature.
- Use any node packages you want, just remember we want to know what _you_ can do.
- Consider how you can show how your feature should work, and prove that it does work.

## Getting started

- this bundle contains a git repository
- work locally, commit changes
- push to your own git service
- share the repository link with us

## Package Scripts

| command              | description                  |
| :------------------- | :--------------------------- |
| `npm run format:fix` | format files with "prettier" |
| `npm run test`       | execute tests with "jest"    |
