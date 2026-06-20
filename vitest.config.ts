import { defineConfig } from "vitest/config";

// The catalogue module is pure (no Next, React, pg or env), so the default node
// environment is all the suite needs — no jsdom, no React plugin.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
