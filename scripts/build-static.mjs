import {
  chmodSync,
  cpSync,
  mkdirSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
const root = process.cwd();
const staging = resolve(root, ".static-build");
rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });
for (const path of [
  "src",
  "messages",
  "public",
  "next.config.ts",
  "tsconfig.json",
  "postcss.config.mjs",
  "package.json",
  "package-lock.json",
])
  cpSync(resolve(root, path), resolve(staging, path), { recursive: true });
// Static hosting has no request middleware. Remove it only from this generated copy.
rmSync(resolve(staging, "src/proxy.ts"));
symlinkSync(
  resolve(root, "node_modules"),
  resolve(staging, "node_modules"),
  process.platform === "win32" ? "junction" : "dir",
);
const result = spawnSync(
  process.execPath,
  [resolve(root, "node_modules/next/dist/bin/next"), "build", "--webpack"],
  {
    cwd: staging,
    env: { ...process.env, STATIC_EXPORT: "1" },
    stdio: "inherit",
  },
);
if (result.status !== 0) process.exit(result.status || 1);
rmSync(resolve(root, "out"), { recursive: true, force: true });
cpSync(resolve(staging, "out"), resolve(root, "out"), { recursive: true });
// Apache shared hosting: serve directory indexes and a real 404, without SPA rewrites.
writeFileSync(
  resolve(root, "out/.htaccess"),
  "DirectoryIndex index.html\nErrorDocument 404 /404.html\n",
);
// Static files must be readable by the hosting web-server user, even with a restrictive local umask.
function setPublicPermissions(directory) {
  chmodSync(directory, 0o755);
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) setPublicPermissions(path);
    else chmodSync(path, 0o644);
  }
}
setPublicPermissions(resolve(root, "out"));
console.log(
  "Static website ready in out/. Upload its contents to your domain document root.",
);
