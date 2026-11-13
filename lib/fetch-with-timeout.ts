const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * `fetch` resolves as soon as headers arrive, so a timeout around the fetch
 * call alone does not bound body reads. The returned response wraps `json`,
 * `text`, `arrayBuffer` and `blob` so a stalled body also aborts.
 */
export async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const callerSignal = init.signal;
  const onCallerAbort = () => controller.abort();

  if (callerSignal) {
    if (callerSignal.aborted) controller.abort();
    else callerSignal.addEventListener("abort", onCallerAbort, { once: true });
  }

  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const cleanup = () => {
    clearTimeout(timer);
    callerSignal?.removeEventListener("abort", onCallerAbort);
  };

  try {
    const response = await fetch(input, { ...init, signal: controller.signal });

    const wrap = <T>(read: () => Promise<T>) => async (): Promise<T> => {
      try {
        return await read();
      } finally {
        cleanup();
      }
    };

    const guarded = response as Response & {
      json: () => Promise<unknown>;
      text: () => Promise<string>;
      arrayBuffer: () => Promise<ArrayBuffer>;
      blob: () => Promise<Blob>;
    };

    guarded.json = wrap(() => response.json());
    guarded.text = wrap(() => response.text());
    guarded.arrayBuffer = wrap(() => response.arrayBuffer());
    guarded.blob = wrap(() => response.blob());

    return guarded;
  } catch (error) {
    cleanup();
    throw error;
  }
}
