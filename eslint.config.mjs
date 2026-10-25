import next from "eslint-config-next/core-web-vitals";
import ts from "eslint-config-next/typescript";

const config = [
  ...next,
  ...ts,
  {
    rules: {
      // Our effects deliberately sync browser-only state (localStorage, matchMedia, the DOM)
      // after hydration, so the server HTML and the first client render stay identical.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
];

export default config;
