const data = require("./data");
const JSPath = require("jspath");

data.forEach(entry => {
  entry.acceptable_cities = entry.acceptable_cities
    ? `|${entry.acceptable_cities.replace(/, */, "|")}|`
    : entry.acceptable_cities;
  entry.unacceptable_cities = entry.unacceptable_cities
    ? `|${entry.unacceptable_cities.replace(/, */, "|")}|`
    : entry.unacceptable_cities;
});

/**
 * This validates the incoming event and generates an appropriate response if an error is detected
 */
function validate(event) {
  const { path, httpMethod, queryStringParameters } = event;
  if (path !== "/") {
    throw { statusCode: 404, message: "/ is the only supported path" };
  }
  if (httpMethod !== "GET") {
    throw { statusCode: 405, message: "GET is the only supported method" };
  }
  if (!queryStringParameters || !queryStringParameters.query) {
    throw {
      statusCode: 400,
      message: 'query string parameter "query" is required'
    };
  }
}

/**
 * This processes the query and returns the zipcodes that satisfy the criteria
 */
function process(queryStringParameters) {
  return JSPath.apply(`.{${queryStringParameters.query}}`, data);
}

/**
 * This is the main entry point for the code
 */
module.exports.handler = event => {
  try {
    validate(event);
    const result = process(event.queryStringParameters);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(result)
    };
  } catch (e) {
    return {
      statusCode: e.statusCode ? e.statusCode : 500,
      body: JSON.stringify({
        message: e.message ? e.message : e
      })
    };
  }
};
