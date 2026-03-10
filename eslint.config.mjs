import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "next-env.d.ts",
      "ai-factory/**",
      ".codex/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**"
    ]
  },
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"]
  })
];

export default eslintConfig;
