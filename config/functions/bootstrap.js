'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

module.exports = async () => {
  const io = require("socket.io")(strapi.server, {
    //   // allow header with Authorization
    handlePreflightRequest: (req, res) => {
      // console.log('req.headers::', req.headers)
      const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": req.headers.origin,
        "Access-Control-Allow-Credentials": true
      };

      res.writeHead(200, headers);
      res.end();
    }
  })

  // io.on("connection", () => {
  //   console.log("Connected!");
  // });

  //Verify token with strapi jwt service
  io.use(async (socket, next) => {
    // console.log('socket.handshake.headers.authorization:', socket.handshake.headers.authorization)

    // req token only not text 'Bearer'
    if (socket.handshake.headers && socket.handshake.headers.authorization) {
      const token = socket.handshake.headers.authorization;
      try {
        const userPermissionService = strapi.plugins["users-permissions"].services;

        //  Verify token fetch user details
        const {id} = await userPermissionService.jwt.verify(token);
        console.log("verify Id Pass!: ", id);
        const user = await userPermissionService.user.fetch({id: id});
        //  Store user details

        socket.user = user;
        next();
      } catch (err) {
        // When token is invalid
        next(new Error("Invalid token Now!" + err));
      }
    } else {
      // When token not found
      next(new Error("No authorization header was found"));
    }
  });

  //save req connection
  io.on("connection", async (socket) => {
    const room = socket.handshake.query.room || "general"

    console.log("Connected with query!", room);
    //  move user to room
    socket.join(room);

    //  debug log user connection
    // strapi.log.debug(`${socket.user.username} connected to a ${room}.`);

    //  listen for user message
    socket.on(room, async (reqMessage) => {
      // console.log('reqMessage::', reqMessage)
      let result = JSON.stringify({
        // save message to database
        reqMessage: await strapi.services.comment.create({
          user: socket.user.id,
          project: reqMessage.project,
          room: room,
          detail: reqMessage.detail
        })
      })
      // console.log('reqMessage 2::', JSON.stringify(reqMessage))

      //send message to other user
      io.to(room).emit(room, result)
    });

    //  listen for user disconnect
    socket.on("disconnect", () => {
      strapi.log.debug(`${socket.user.username} disconnect from a room ${room}.`)
    });
  })
  ;

  // register socket io inside strapi main object to user it globally anyWhere
  strapi.io = io;

  // console.log("text connect server::", strapi.server);

};


