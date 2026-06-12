# NGINX with Angular

**Here's a complete example that demonstrates:**
+ Serve Angular Static Files
+ Cache Static Assets
+ Rate Limiting
+ Dockerized Angular + Nginx

**Tutorials**
1. Deploy angular app on nginx from scratch | Deploying angular in nginx server on Windows : https://www.youtube.com/watch?v=Wf-6idVVis4
2. Dockerize an Angular Application using Nginx : https://www.youtube.com/watch?v=-o5l6zFJ9_o
3. How to Deploy an Angular Application 2024 (Docker, Nginx & Digitalocean) : https://www.youtube.com/watch?v=ERVAFkj66QQ
4. deploying-angular-apps-nginx-docker : https://www.telerik.com/blogs/deploying-angular-apps-nginx-docker

## Run Application

**Build Docker Image**
```
docker build -t angular-nginx-demo .
```
**Run Container**
```
docker run -p 8080:80 angular-nginx-demo
```

**Production Enterprise Flow**
```
User
 │
 ▼
NGINX
 │
 ├── Angular Static Files
 │      └── Cached 30 Days
 │
 └── API Requests
        │
        └── Rate Limited
                │
                ▼
            Backend
```

**Verify Static Asset Caching**

Open browser DevTools → Network. You should see headers similar to:
```
Cache-Control: public,max-age=2592000
Expires: Sun, 12 Jul 2026 ...
```
This means:
```
logo.png
main.js
styles.css
```
Cached for 30 days

**Verify Rate Limiting**

Click:
```
Trigger 20 API Calls
```
Nginx allows:
```
5 requests/sec
Burst = 10
```
You will see:
```
200 OK
```
for allowed requests and eventually:
```
429 Too Many Requests
```
for excess requests.


## Why NGINX ?

**✅ Angular can run in Docker without Nginx using ng serve (development).**   
**✅ For production, Angular is usually served by Nginx (or another web server) inside Docker because Angular becomes static files after ng build.**  
**✅ In production, Angular is usually served through Nginx, not directly through Angular's development server (ng serve).**   

**Development Environment**
```
Browser
   │
   ▼
Angular Dev Server
(ng serve)
   │
   ▼
localhost:4200
```
Used only during development.

**Production Architecture**
```
                Browser
                   │
                   ▼
                Nginx
                   │
                   ▼
            Angular Files
        (HTML, JS, CSS, Assets)
```
**When you run:**
```
ng build --configuration production
```
**Angular generates:**
```
dist/
 ├── index.html
 ├── main.js
 ├── polyfills.js
 ├── styles.css
 └── assets/
```
Nginx serves these files.

## Angular + Nginx + Backend

Most common architecture:
```
                    Browser
                       │
                       ▼
                    Nginx
                 (Port 80/443)
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
    Angular Files              Node.js API
   /index.html                /api/*
   /main.js
```

Example:
```
https://mybank.com
```
Served by Nginx.
```
https://mybank.com/api/login
```
Forwarded by Nginx to Node.js.

## Why Nginx is Used for Angular

**1. Serve Static Files Efficiently**

Angular files:
```
index.html
main.js
styles.css
```
Nginx is extremely fast at serving them.

**2. Gzip/Brotli Compression**

Without compression:
```
main.js = 8 MB
```
With Nginx:
```
main.js = 1.5 MB
```
Faster page loads.

**3. HTTPS / SSL**
```
Browser
   │ HTTPS
   ▼
 Nginx
```
Nginx manages SSL certificates.

Angular doesn't need to.

**4. Caching**
```
main.js
styles.css
logo.png
```
Can be cached by Nginx.
```
location ~* \.(js|css|png|jpg)$ {
    expires 1y;
}
```

**5. Reverse Proxy**
```
Angular
   │
   ▼
Nginx
   │
   ▼
Node.js API
```
Users see:
```
https://mybank.com
```
instead of:
```
https://mybank.com:3000
```

## Enterprise Banking Setup
```
                Customer Browser
                       │
                       ▼
                    Nginx
              SSL + Load Balancer
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
      Angular UI              Node.js APIs
                                   │
                                   ▼
                                 Redis
                                   │
                                   ▼
                              Database
```

Angular is typically built into static files (HTML, JavaScript, CSS) using ng build. 
Nginx serves these static assets, handles HTTPS, compression, browser caching, and acts as a reverse proxy for backend APIs.
In production, users access Angular through Nginx rather than the Angular development server.

## Enterprise Angular + Node.js + Redis + Nginx
```
                     Browser
                        │
                        ▼
                 ┌────────────┐
                 │   Nginx    │
                 └─────┬──────┘
                       │
        ┌──────────────┼──────────────┐
        ▼                             ▼
 Angular Static Files          Node.js APIs
                                     │
                                     ▼
                               Redis Cache
                                     │
                                     ▼
                                 Database
```

**Request Flow**
1. Browser requests Angular app → Nginx serves static files.
2. Angular calls /api/orders.
3. Nginx forwards request to Node.js.
4. Node.js checks Redis cache.
5. If cache miss → database query.
6. Result stored in Redis.
7. Response returned through Nginx.

## Angular normally can't run inside Docker without Nginx ?
Yes, Angular can run inside Docker without Nginx, but it depends on whether you're running it in development mode or production mode.

Option 1: Angular without Nginx (Development)
----------------------------------------------------------------------------------
You can run Angular's built-in development server (ng serve) inside Docker.

**Dockerfile**
```
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "start"]
```

**Run**
```
docker build -t angular-app .
docker run -p 4200:4200 angular-app
```

**Angular CLI starts:**
```
ng serve --host 0.0.0.0
```

**Architecture:**
```
Browser
   │
   ▼
Angular Dev Server (ng serve)
   │
   ▼
Docker Container
```

**Problems**
- Not optimized
- Larger memory usage
- Slower
- No compression
- No caching
- Not recommended for production


Option 2: Angular with Nginx (Production)
----------------------------------------------------------------------------------
**Build Angular and serve static files through Nginx.**
```
Build Angular
ng build --configuration production
```

**Generated files:**
```
dist/
 ├── index.html
 ├── main.js
 ├── styles.css
 └── assets/
```

**Dockerfile**
```
# Build Stage
FROM node:22 AS build

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

# Runtime Stage
FROM nginx:alpine

COPY --from=build /app/dist/my-app/browser /usr/share/nginx/html

EXPOSE 80
```

**Architecture:**
```
Browser
   │
   ▼
Nginx
   │
   ▼
Angular Static Files
(index.html, JS, CSS)
```

**Benefits:**
- Fast
- Gzip compression
- Browser caching
- SPA routing support
- Production ready


