module.exports = {
  apps: [
    {
      name: "wedinvites",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/var/www/wedinvites",
      instances: 1, // Set to 2 or 'max' if your KVM2 VPS has 2+ vCPUs and adequate RAM (4GB+)
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/wedinvites/error.log",
      out_file: "/var/log/wedinvites/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
