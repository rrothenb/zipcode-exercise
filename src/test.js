const { handler } = require("./index");

async function runTest(event) {
  return await handler(event);
}
async function runBasicTest(query) {
  const response = await runTest({
    httpMethod: "GET",
    path: "/",
    queryStringParameters: {
      query
    }
  });
  return JSON.parse(response.body);
}

describe("happy path", () => {
  test("search by full zipcode", async () => {
    const zipcode = "01001";
    const response = await runBasicTest(`.zip == "${zipcode}"`);
    expect(response).toHaveLength(1);
    expect(response[0].zip).toEqual(zipcode);
  });
  test("search by partial zipcode", async () => {
    const partialZipcode = "010";
    const response = await runBasicTest(`.zip *== "${partialZipcode}"`);
    expect(response.length).toBeGreaterThan(0);
    response.every(entry => expect(entry.zip).toContain(partialZipcode));
  });
  test("search by full city name", async () => {
    const cityName = "Boston";
    const response = await runBasicTest(
      `.primary_city == "${cityName}" || .acceptable_cities *== '|${cityName}|'`
    );
    expect(response.length).toBeGreaterThan(0);
    response.every(entry => expect(entry.primary_city).toEqual(cityName));
  });
  test("search by partial city name", async () => {
    const response = await runBasicTest(
      `.primary_city ^== "East " || .acceptable_cities *== '|East '`
    );
    expect(response.length).toBeGreaterThan(0);
    response.every(entry => expect(entry.primary_city).toMatch(/^East.*/));
  });
  test("search by closest lat/lon (sort of)", async () => {
    const response = await runBasicTest(
      `.latitude >= 42.34 && .latitude <= 42.36 && .longitude >= -71.06 && .longitude <= -71.04`
    );
    expect(response.length).toBeGreaterThan(0);
    response.every(entry => expect(entry.primary_city).toEqual("Boston"));
  });
  test("filter by additional attributes", async () => {
    await runBasicTest(
      '.estimated_population > 14000 && .estimated_population < 15000 && .state == "ME"'
    );
  });
});

describe("error cases", () => {
  test("No path", async () => {
    const response = await runTest({});
    expect(response.statusCode).toEqual(404);
    expect(response.body).toContain("/ is the only supported path");
  });
  test("No method", async () => {
    const response = await runTest({
      path: "/"
    });
    expect(response.statusCode).toEqual(405);
    expect(response.body).toContain("GET is the only supported method");
  });
  test("No query", async () => {
    const response = await runTest({
      path: "/",
      httpMethod: "GET"
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toContain(
      'query string parameter \\"query\\" is required'
    );
  });
  test("Invalid query", async () => {
    const response = await runTest({
      path: "/",
      httpMethod: "GET",
      queryStringParameters: {
        query: 'This is not a very good query'
      }
    });
    expect(response.statusCode).toEqual(500);
    expect(response.body).toContain(
      'Unexpected token'
    );
  });
});
