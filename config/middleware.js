module.exports = ({ env }) => ({
  settings: {
    cache: {
      enabled: true,
      // models: ["posts"],
      models: ["posts", "advisors", "comments","scores","downloads"],
    },
  },
});
