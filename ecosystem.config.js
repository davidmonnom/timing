module.exports = {
  apps: [
    {
      name: "timing",
      instances: "1",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 4444",
      exp_backoff_restart_delay: 100,
      watch: true,
      max_memory_restart: "400M",
    },
  ],
  deploy: {
    production: {
      key: "~/.ssh/kadiix_vps",
      user: "kadiix",
      host: ["87.106.62.141"],
      ref: "origin/main",
      repo: "git@deployment:davidmonnom/timing.git",
      path: "/home/kadiix/pm2/timing",
      "post-deploy":
        "export NVM_DIR=~/.nvm && source ~/.nvm/nvm.sh && npm install && npm run build && pm2 startOrRestart ecosystem.config.js -p 4444",
    },
  },
};
