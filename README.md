# NGINX
NGINX frequently acts as a reverse proxy, load balancer, API gateway, and HTTP cache

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




