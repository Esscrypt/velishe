import { registerOTel } from "@vercel/otel";

export function register() {
  // Instrumentation also runs for the edge runtime, where there is no Node
  // process to trace; registering there only adds cold-start work.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    registerOTel({ serviceName: "velishe-web" });
  }
}
