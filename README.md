# NGINX
- Tutorial : https://nginx.org/

NGINX (pronounced "engine x") is a free, open-source web server known for its high performance, stability, and low resource usage. Beyond serving static web pages, it frequently acts as a reverse proxy, load balancer, API gateway, and HTTP cache.

## Core Capabilities
- **Reverse Proxy**: Intercepts client requests and forwards them to backend servers, hiding the internal network structure for enhanced security and performance.
- **Load Balancing**: Distributes incoming network traffic across multiple backend servers to ensure no single server gets overwhelmed, improving app scalability and uptime.
- **Caching**: Stores copies of frequently requested content, enabling the server to respond instantly without querying backend resources repeatedly.

## Why Choose NGINX?
- **High Concurrency**: Designed to handle thousands of simultaneous connections with a very small memory footprint, making it ideal for high-traffic environments.
- **Resource Efficiency**: Uses an asynchronous, event-driven architecture rather than creating new threads for every request, reducing RAM usage under heavy loads.
- **Security & SSL**: Can easily handle SSL/TLS encryption and decryption before passing traffic to backend applications.

## What Top Companies Commonly Use?
- Netflix → Nginx + custom infrastructure
- Airbnb → Nginx as reverse proxy
- Dropbox → Nginx extensively
- GitHub → Nginx and HAProxy combinations
- Cloudflare → Nginx-inspired and custom proxy technologies

## Nginx vs other servers
Nginx is primarily chosen for reverse proxying, SSL termination, static file serving, API gateway functionality, caching, and load balancing. Apache remains common in legacy environments, HAProxy excels at high-performance load balancing, and Caddy simplifies HTTPS management. In modern microservices and cloud-native architectures, Nginx is often the default front-door server because it efficiently handles large numbers of concurrent connections while integrating well with application servers such as Node.js, Java Spring Boot, and .NET.

| Feature             | Nginx       | Apache HTTP Server | HAProxy     | Caddy       |
| ------------------- | ----------- | ------------------ | ----------- | ----------- |
| Web Server          | ✅           | ✅                  | ❌           | ✅           |
| Reverse Proxy       | ✅           | ✅                  | ✅ Excellent | ✅           |
| Load Balancer       | ✅           | Basic              | ✅ Best      | ✅           |
| Static File Serving | ✅ Excellent | ✅ Good             | ❌           | ✅           |
| SSL/TLS             | ✅           | ✅                  | ✅           | ✅ Automatic |
| Memory Usage        | Low         | Higher             | Very Low    | Low         |
| Configuration       | Moderate    | Easy               | Advanced    | Very Easy   |
| Enterprise Usage    | Very High   | High               | Very High   | Growing     |

```
Need Web Server?
   → Nginx

Need Advanced Load Balancing?
   → HAProxy

Need Both?
   → HAProxy + Nginx
```
HAProxy can handle millions of connections and is often used in banks, telecoms, and large SaaS platforms.

## Modern Enterprise Banking Architecture
```
                    Internet
                        │
                        ▼
                    Nginx
              (Reverse Proxy)
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
     Node API 1     Node API 2     Node API 3
                        │
                        ▼
                     Redis
                        │
                        ▼
                   PostgreSQL
```

Nginx responsibilities:
- SSL/TLS termination
- Rate limiting
- Load balancing
- Static asset serving
- Response caching

Redis responsibilities:
- Session storage
- Token storage
- Data caching

## Redis vs Nginx
| Feature              | Redis Cache                                    | Nginx Cache                                  |
| -------------------- | ---------------------------------------------- | -------------------------------------------- |
| Cache Location       | Memory (RAM)                                   | Disk (Hard Drives & SSDs) + Memory (RAM)     |
| Speed                | Extremely Fast (sub-ms)                        | Fast                                         |
| Best For             | Dynamic data, database query results, sessions | HTTP responses, static assets, API responses |
| Data Structure       | Strings, Hashes, Lists, Sets, Streams          | HTTP response only                           |
| Persistence          | Optional                                       | Disk-based                                   |
| Scalability          | Distributed cache cluster                      | Reverse proxy cache                          |
| Session Storage      | ✅ Excellent                                    | ❌ Not suitable                               |
| API Response Cache   | ✅                                              | ✅                                            |
| Database Query Cache | ✅                                              | ❌                                            |
| Static Files         | ❌                                              | ✅ Excellent                                  |

When to Use Redis
---------------------------------------------------------------------------------
Use Redis when caching application data.

Example:
```
Angular
   ↓
Node API
   ↓
Redis Cache
   ↓
PostgreSQL
```
User requests:
```
GET /customers/100
```
Flow:
1. Check Redis
2. If found → return data
3. Else query DB
4. Save in Redis
5. Return response

Redis stores:
```
customer:100
{
  "id":100,
  "name":"John"
}
```
Best for:  
✅ User Sessions  
✅ JWT Blacklist  
✅ Shopping Cart  
✅ Database Query Results  
✅ Frequently Accessed Data  
✅ Rate Limiting  
✅ Real-time Systems  

When to Use Nginx Cache
---------------------------------------------------------------------------------
Use Nginx when caching HTTP responses.

Architecture:
```
Browser
   ↓
Nginx Cache
   ↓
Node API
   ↓
Database
```
First request:
```
GET /products
```
Flow:
```
Nginx Miss
   ↓
Node API
   ↓
Database
   ↓
Response Stored in Nginx Cache
```
Second request:
```
Nginx Hit
   ↓
Response Directly Returned
```
Node.js is not called.

Best for:  
✅ Product Catalog APIs  
✅ News APIs  
✅ Public APIs  
✅ Images  
✅ CSS/JS Files  
✅ CDN-like Caching  

## Interview Answer (Senior Level)
Use Nginx cache to cache HTTP responses at the edge/reverse-proxy layer and reduce traffic reaching the application servers. Use Redis to cache application data such as sessions, database query results, user profiles, permissions, and rate-limiting counters. Nginx and Redis are complementary technologies and are commonly used together in enterprise-scale systems.

**Rule of Thumb**
```
Caching HTTP Response?
     → Nginx

Caching Database Data?
     → Redis

Caching Session?
     → Redis

Caching Static Files?
     → Nginx

Caching JWT/Refresh Token?
     → Redis

Enterprise Production System?
     → Use Both
```

## Banking Application Example
Suppose:
```
Angular 19
   ↓
Nginx
   ↓
Node.js
   ↓
Redis
   ↓
PostgreSQL
```
Use Redis For
- Session ID
- Refresh Token
- User Permissions
- OTP Attempts
- Rate Limiting
- Customer Data

Example:
```
session:abc123
user:100
```

Use Nginx For
```
Angular bundle files
main.js
styles.css
logo.png
```
Also:
```
GET /interest-rates
GET /branch-locations
```
These change rarely and can be cached by Nginx.

```
                    ┌───────────────┐
                    │ Angular 19 UI │
                    └───────┬───────┘
                            │
                            ▼
                 ┌────────────────────┐
                 │      Nginx         │
                 │ HTTP Cache Layer   │
                 └─────────┬──────────┘
                           │
                 Cache Miss│
                           ▼
                 ┌────────────────────┐
                 │    Node.js API     │
                 └─────────┬──────────┘
                           │
                  Check Cache
                           ▼
                 ┌────────────────────┐
                 │       Redis        │
                 │ Application Cache  │
                 └─────────┬──────────┘
                           │
                  Cache Miss
                           ▼
                 ┌────────────────────┐
                 │   PostgreSQL DB    │
                 └────────────────────┘
```




