import {expect, test} from "@playwright/test";

test("BasicRoute", async ({page}) => {
    await page.goto("/");
    await page.waitForSelector("#content");

    const content = (await page.textContent("#content"))?.trim();
    expect(content).toBe("this is a basic route");
});

test("ContextRoute", async ({page}) => {
    await page.goto("/#fetch");
    await page.waitForSelector("#content");

    const content = (await page.textContent("#content"))?.trim();
    expect(content).toBe("Hello, Playwright!");
});

test("Fallback", async ({page}) => {
    await page.goto("/#fallback");

    const content = await page.textContent("body");
    expect(content).toContain("no route found");
});

test("FetchRoute", async ({page}) => {
    await page.goto("/#fetch");
    await page.waitForSelector("#content");

    const content = (await page.textContent("#content"))?.trim();
    expect(content).toBe("Hello, You!");
});

test("NavigatingRoute", async ({page}) => {
    await page.goto("/#navigating");

    const body_content = await page.textContent("body");
    expect(body_content).toContain("navigating");

    await page.waitForSelector("#content");

    const route_content = (await page.textContent("#content"))?.trim();
    expect(route_content).toBe("this the navigating route");
});

test("QueryParamsRoute", async ({page}) => {
    await page.goto("/#/queryparams?message=World");
    await page.waitForSelector("#content");

    const content = (await page.textContent("#content"))?.trim();
    expect(content).toBe("Hello, World!");
});

test("RouteParamsRoute", async ({page}) => {
    await page.goto("/#/routeparams/Svelte");
    await page.waitForSelector("#content");

    const content = (await page.textContent("#content"))?.trim();
    expect(content).toBe("Hello, Svelte!");
});

test("ServicesRoute", async ({page}) => {
    await page.goto("/#/services");
    await page.waitForSelector("#content");

    const content = (await page.textContent("#content"))?.trim();
    expect(content).toMatch(/the random value was: \d+\.\d+!/);
});
