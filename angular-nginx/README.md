# NGINX with Angular

**Tutorials**
1. Deploy angular app on nginx from scratch | Deploying angular in nginx server on Windows : https://www.youtube.com/watch?v=Wf-6idVVis4
2. Dockerize an Angular Application using Nginx : https://www.youtube.com/watch?v=-o5l6zFJ9_o

In production, Angular is usually served through Nginx, not directly through Angular's development server (ng serve).

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
                              PostgreSQL
```

Angular is typically built into static files (HTML, JavaScript, CSS) using ng build. 
Nginx serves these static assets, handles HTTPS, compression, browser caching, and acts as a reverse proxy for backend APIs.
In production, users access Angular through Nginx rather than the Angular development server.
