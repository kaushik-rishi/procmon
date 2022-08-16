# Procmon

## Setup

-   socketserver
    -   run the socket server using `node masterServer.js`
    -   server runs on port 8181
    -   `ngrok http 8181` -> generates a globally accessible url for `http://localhost:8181`
    -   copy that server url (hosted server url)
-   nodeclient
    -   `npm install -g .` -> install the procmon nodeclient cli
    -   run `procmon {hosted server url}` -> starts streaming the computer data to server
-   browserclient
    -   change the `serverUrl` in `src/config.js` to the hosted server url
    -   open the react app in browser to visualise the data

### Components

-   nodeclient (command line tool - run on server instance)
-   browserclient (react js - browser frontend)
-   socketserver (express js server - hosted on ec2)
