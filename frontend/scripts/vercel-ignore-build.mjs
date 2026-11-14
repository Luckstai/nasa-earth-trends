import { spawnSync } from "node:child_process";

// Vercel: exit 0 skips the build; exit 1 proceeds with the build.
// Compare with the last successful deployment, including pushes with multiple commits.
const previous = process.env.VERCEL_GIT_PREVIOUS_SHA;
if (!previous || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i.test(previous)) {
  console.log("No previous successful deployment; build required.");
  process.exit(1);
}

// The Vercel Root Directory is frontend/, so '.' excludes unrelated repository files.
const diff = spawnSync(
  "git",
  ["diff", "--quiet", previous, "HEAD", "--", "."],
  {
    stdio: "ignore",
  },
);

if (diff.status === 0) {
  console.log(
    "Frontend unchanged since the previous successful deployment; skipping.",
  );
  process.exit(0);
}

// Missing Git history and Git errors must allow a build instead of hiding an update.
console.log("Frontend changed or history unavailable; build required.");
process.exit(1);
