module.exports = {
  apps: [
    {
      name: "kalavridhi",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/var/www/kalavridhi",
      // The CMS writes JSON files to local disk. Use one process to avoid concurrent file writes.
      instances: 1,
      exec_mode: "fork",
      env: { NODE_ENV: "production", PORT: "3000" },
      restart_delay: 4000,
      max_memory_restart: "600M",
      time: true,
    },
  ],
};
