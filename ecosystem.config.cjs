module.exports = {
  apps: [
    {
      name: "superbazi-web",
      exec_mode: "cluster",
      script: "./.output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        HOST: process.env.HOST || "0.0.0.0",
        PORT: process.env.PORT || 3355,
      },
    },
  ],
};
