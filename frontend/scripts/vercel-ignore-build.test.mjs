import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(
  new URL("./vercel-ignore-build.mjs", import.meta.url),
);
const gitEnv = {
  ...process.env,
  GIT_CONFIG_NOSYSTEM: "1",
  GIT_CONFIG_GLOBAL: "/dev/null",
};
let root, previous;
function git(...args) {
  return execFileSync("git", args, {
    cwd: root,
    env: gitEnv,
    encoding: "utf8",
  }).trim();
}
function commit(message) {
  git("add", ".");
  git(
    "-c",
    "user.name=Lucas Henrique",
    "-c",
    "user.email=lucas.henrique.tai@gmail.com",
    "commit",
    "--quiet",
    "-m",
    message,
  );
}
function decision(base = previous) {
  return spawnSync(process.execPath, [script], {
    cwd: join(root, "frontend"),
    env: { ...gitEnv, VERCEL_GIT_PREVIOUS_SHA: base },
  }).status;
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "kipp-deploy-"));
  mkdirSync(join(root, "frontend"));
  git("init", "--quiet", "--initial-branch=main");
  writeFileSync(join(root, "frontend", "index.html"), "KIPP");
  writeFileSync(join(root, "README.md"), "KIPP documentation");
  commit("Initial fixture");
  previous = git("rev-parse", "HEAD");
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("Vercel frontend deployment filtering", () => {
  it("builds the first deployment and when Git history is unavailable", () => {
    expect(decision("")).toBe(1);
    expect(decision("a".repeat(40))).toBe(1);
  });
  it("skips an unchanged frontend and changes outside its root directory", () => {
    expect(decision()).toBe(0);
    writeFileSync(join(root, "README.md"), "Updated project documentation");
    commit("Update documentation");
    expect(decision()).toBe(0);
  });
  it("builds frontend changes across every commit since the successful deployment", () => {
    writeFileSync(
      join(root, "frontend", "index.html"),
      "Updated KIPP application",
    );
    commit("Update frontend");
    writeFileSync(join(root, "README.md"), "Later documentation-only commit");
    commit("Update documentation");
    expect(decision()).toBe(1);
  });
});
