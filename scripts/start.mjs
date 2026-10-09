import { cpSync } from "node:fs";
import { resolve } from "node:path";
const standalone = resolve(".next/standalone");
cpSync("public", resolve(standalone, "public"), { recursive: true });
cpSync(".next/static", resolve(standalone, ".next/static"), {
  recursive: true,
});
process.env.HOSTNAME = "0.0.0.0";
await import(resolve(standalone, "server.js"));
