c# nginx-setup
Setting up and understanding basic functionalities of nginx

## What is nginx?
Initially, nginx was a piece of software that runs on server machine and can respond to request from browser and when number of requests increased the number of nginx server increased then to handle number of requests navigation to number of nginx server the Nginx acted as a `load balancer` which distribute incoming traffic to multiple server to avoid redundancy which is reverse proxied and distributed the load to different nginx servers using load balancing methods like `least connections` and round `robin algorithm`

Nginx = Web Server and Proxy Server.

## Functionalities of Nginx:
1. `Load Balancer`
2. `Caching`: Fetching data from remote servers or database on each request results in slower response times. Instead do fetching of data just once, store the response and send whenever requested.
3. `One entrypoint`: Proxy is publicly accessible only and acts as shield for many other servers which enhance security
4. `Encrypted communication`: Proxy server should get encrypted message and pass on encrypted traffic to other server by configuring proxy for SSL encryption
5. `Compression`: Configured to compress large video and image files to reduce bandwidth usage and improve load times and break files into chunks (video streaming)
6. `web app firewall`
7. `internal ddos protection`
8. `api gateway`
9. 

## How to configure nginx?
Nginx has nginx.conf file located in `/etc/nginx` configure using directives and blocks as web server or proxy server.

All http request should be sent to https endpoint where we have https server configured which serves the file and have ssl certificate configured

`Directives`: Location -> Defines how server should process the specific types of request 

In Kubernetes, the nginx is used as ingress controller. The request from Cloud load balancer is forwarded to nginx ingress controller and then reaches to the cluster
![alt text](image.png)


## Create an express app which serve static html with images

1. Install npm
2. Install express
3. Create server.js and write the routes for '/' and 'images' and add port number to serve
4. Create index.html
   
`When we run the app and hit on localhost:8080 browser directly request the server ` No security.

## Dockerize the app and start 3 instances of the app

We are creating container environment:
 - Install node
 - Create app folder and set as working directory
 - Copy files like server.js, index.html, images, package.json from local to Docker image
 - Install dependencies and run app

## Start docker application
- Start docker in your local
- Verify by running `docker info`
- Run `docker run hello world` -> This will pull hello world image from docker registry
- Build the image of our app by running:
  - `docker build -t blogapp:1.0 .`
- Check if image is built by:
  - `docker images | grep blogapp`

## Run multiple containers with images:
- Bind port from local port to docker container port `docker run -p 3000:3000 blogapp:1.0` 
- The app will run on localhost:3000

### Start 3 containers of docker using `docker-compose up`

- Add 3 services app1, app2, app3 and define the ports
- Pass the environment variable from docker-compose.yaml to application in server.js to check which container is running
  - const replicaApp = process.env.APP_NAME

Output:
app1-1  | Request served by App1
app2-1  | Request served by App2
app3-1  | Request served by App3

### Add nginx before these 3 docker containers
We dont have to access each replica separately one by one so we need only 1 entry point which then forwards request to different containers.

### Configuring nginx to act as load balancer:
   - Install nginx on macOS: `brew install nginx`
   - Check version: `nginx -v`
   - To find location of nginx installed: `whereis nginx `
   - To find the configuration file contents: `cat etc/nginx/nginx.conf`
  
### nginx configuration file:
1. worker_processes and master_process
   1. `Directives` - Key value pairs are called directives. 
   2. master_processes starts automatically as the nginx run. This handles all the worker_processes which actually handle the incoming requests. We can define how many worker_processes should run and each worker processes can handle how many connections via `worker_connections`
   3. `worker_processes` handles request using `single threaded event loop`. Here single thread handles multiple task through asynchronous operation. We have `event queue` where all the operations like incoming request/IO operations are placed. 
   4. When event loop receives request it places it starts the task like querying db and it does not wait instead it moves to next task and initial task continues in background and when its done its added to queue. Event loop continuously checks the event queue for completed task and executes them in order. So in similar way `worker_processes` handles using event loop.
   5. Number of worker processes can influence how well the nginx can handle traffic. More processes more better but worker processes should be configured as per cpu cores. Where 1 workerprocess = 1 core


### Few top level Contexts 
1. events - general connection processes
2. http - http traffic. How client request is handled?
3. mail - mail traffic
4. stream - tcp udp

Contexts placed outside of these are considered to be in main context

2. `http` - how to handle http request from domain or ip?
     - How to listen for connections
     - which domain or subdomain the configuration applies to
     - how to route requests

`server block` -> defines an HTTP server that listens for incoming requests
- Set nginx to listen on port 8080
    `listen 8080`
- Set which ip or domain should of the request. Where is the client sending the response to?
    `server_name localhost` (ip or domain)
<pre>
server {
  listen 8080;
  server_name localhost;
  location / {
    proxy_pass http://nodejs_cluster;
  }
}
</pre>
- `upstream`:  Group of backend servers like app1,app2,app3 running on different ips or ports. The upstream block help with load balancing

- `include mime.types` - file types to be sent as response like index.html, images etc 

- `load balancing algorithm`: Which algo to use to route requests to server. 
            types: Round robin, least connections, ip hash
    
