module.exports = ({env}) => ({
  settings: {
    // cors: {
    //   enabled: true,
    //   origin: 'http://localhost:3001',
    //   methods: ["Content-Type", "Authorization", "X-Frame-Options"],
    // },
    cache: {
      enabled: true,
      // models: ["posts"],
      models: ["posts", "advisors", "comments", "scores", "downloads"],
    },
  },
});
