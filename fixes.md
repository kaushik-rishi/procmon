## socket.io cors error

-   Hack on the frontend
    but this will ruin the main advantage of `socket.io` i.e long polling fallback option
    if we wanted to do this there was no need of using `socket.io` we could just use
    `native websockets`

```js
const socket = io("https://localhost:8181", { transport: ["websocket"] });

// or this works sometimes
let socket = io("http://localhost:8181", {
    transports: ["websocket", "polling", "flashsocket"],
});
```

-   Fix on backend [PROPER]

```js
const socketio = require("socket.io");

// ....

const app = express();
const server = app.listen(0, "127.0.0.1");

// ....

const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000", // frontend url
        // origin: "*" // allow all url:port combinations to connect to socket-server
    },
});

// 🚀 The idea is to pass a `cors configuration object`. This object can be customised to maximum extent (see cors docs)
```

**Reference:**

-   [Answer](https://stackoverflow.com/a/64805972)
-   [Docs](https://socket.io/docs/v3/handling-cors/)
-   [CORS Configuration options](https://www.npmjs.com/package/cors#configuration-options)

## React JS relative imports prevention.

-   Goal: Share a set of variables among 3 node projects
