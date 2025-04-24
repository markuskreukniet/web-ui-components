import { spawn } from "node:child_process";

const nodePath = process.env.npm_node_execpath ?? process.execPath;
const processes = [];

function startWorkspaceDev(workspace) {
  processes.push(
    spawn(nodePath, [process.env.npm_execpath, "run", "dev", "-w", workspace], {
      stdio: "inherit",
    }),
  );
}

startWorkspaceDev("packages/shared");
startWorkspaceDev("apps/solid-playground");

let shuttingDown = false;

function shutdown(signal) {
  if (!shuttingDown) {
    shuttingDown = true;

    for (const p of processes) {
      p.kill(signal);
    }
  }
}

["SIGINT", "SIGTERM", "SIGHUP"].forEach((signal) => {
  process.on(signal, shutdown);
});
