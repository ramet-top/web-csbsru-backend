module.exports = ({ env }) => ({
  // const icon = pluginPkg.strapi.icon;
  // const name = pluginPkg.strapi.name;
  // const plugin = {
  //   // ...
  //   icon,
  //   name,
  //   menu: {
  //     // Set a link into the PLUGINS section
  //     pluginsSectionLinks: [
  //       {
  //         destination: `/plugins/${pluginId}`, // Endpoint of the link
  //         icon,
  //         name,
  //         label: {
  //           id: `${pluginId}.plugin.name`, // Refers to a i18n
  //           defaultMessage: 'MY PLUGIN',
  //         },
  //       },
  //     ],
  //   },
  // },

  upload: {
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_ACCESS_SECRET'),
      region: env('AWS_REGION'),
      params: {
        Bucket: env('AWS_BUCKET'),
      },
    },
  }
});