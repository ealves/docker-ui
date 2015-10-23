# docker-ui
A web interface to list and show logs of containers from Docker, keeping a real time experience with Socket.IO and NodeJs.

## Getting Started

#### Listing containers

- Clone this repository to your docker server machine;
- Run node server.js and access http://yourdockerip:8080 to list your containers.

#### Logging containers

- Inside image/server.js change 'fileToTail' to your log file;
- Copy image/server.js inside the container image;
- Use forever to start the container server.js automatically after boot;
- Access http://yourdockerip:8080 and click on 'Log' to view real time loggging.

#### Dependencies

- NodeJs
- Socket.io;
- Express;
- Tail;
- AngularJs.
