import { afterEach, describe, expect, test } from "bun:test";
import { fetchWithTimeout } from "./fetch-with-timeout";

const realFetch = globalThis.fetch;

function stubFetch(response: Response) {
  globalThis.fetch = (async () => response) as unknown as typeof fetch;
}

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("fetchWithTimeout", () => {
  test("reads a JSON body instead of recursing into the wrapper", async () => {
    stubFetch(
      new Response(JSON.stringify({ gallery: [1, 2, 3] }), {
        headers: { "content-type": "application/json" },
      }),
    );

    const response = await fetchWithTimeout("http://example.invalid");
    const body = (await response.json()) as { gallery: number[] };

    expect(body.gallery).toEqual([1, 2, 3]);
  });

  test("reads a text body", async () => {
    stubFetch(new Response("hello"));

    const response = await fetchWithTimeout("http://example.invalid");

    expect(await response.text()).toBe("hello");
  });

  test("reads an array buffer body", async () => {
    stubFetch(new Response(new Uint8Array([1, 2, 3])));

    const response = await fetchWithTimeout("http://example.invalid");
    const buffer = await response.arrayBuffer();

    expect(new Uint8Array(buffer)).toEqual(new Uint8Array([1, 2, 3]));
  });

  test("reads a blob body", async () => {
    stubFetch(new Response("blob content"));

    const response = await fetchWithTimeout("http://example.invalid");

    expect(await (await response.blob()).text()).toBe("blob content");
  });

  test("aborts a body read that outlives the timeout", async () => {
    let aborted = false;

    globalThis.fetch = (async (_input: string, init: RequestInit = {}) => {
      const signal = init.signal!;
      const body = new ReadableStream({
        start(controller) {
          signal.addEventListener("abort", () => {
            aborted = true;
            controller.error(new DOMException("Aborted", "AbortError"));
          });
        },
      });
      return new Response(body);
    }) as unknown as typeof fetch;

    const response = await fetchWithTimeout("http://example.invalid", {}, 10);

    await expect(response.text()).rejects.toThrow();
    expect(aborted).toBe(true);
  });

  test("keeps status and headers readable", async () => {
    stubFetch(
      new Response("nope", {
        status: 404,
        headers: { "x-test": "1" },
      }),
    );

    const response = await fetchWithTimeout("http://example.invalid");

    expect(response.status).toBe(404);
    expect(response.ok).toBe(false);
    expect(response.headers.get("x-test")).toBe("1");
  });
});
