# Forward Proxy vs Reverse Proxy

<img src="https://media.geeksforgeeks.org/wp-content/uploads/20250808121519648417/forward_proxy.webp" width="100%" />

```
Forward Proxy represents the CLIENT
Reverse Proxy represents the SERVER

Forward Proxy  → Hides Clients from Servers
Reverse Proxy  → Hides Servers from Clients

Forward Proxy → Protects and represents clients
Reverse Proxy → Protects and represents servers
```

**Common Technologies**
- **Forward Proxy**: Squid, VPNs, corporate proxies
- **Reverse Proxy**: Nginx, HAProxy, Traefik, Envoy

| Feature    | Forward Proxy            | Reverse Proxy        |
| ---------- | ------------------------ | -------------------- |
| Represents | Client                   | Server               |
| Hides      | Client IP                | Server IP            |
| Located    | Client Side              | Server Side          |
| Used By    | Users/Organizations      | Website Owners       |
| Main Goal  | Client anonymity/control | Scalability/security |
| Example    | Corporate Proxy, VPN     | Nginx, HAProxy       |

## A common interview question is: "Is Nginx a forward proxy or reverse proxy?"
Answer: Primarily a reverse proxy, though it can also be configured as a forward proxy. 
In production systems, Nginx is overwhelmingly used as a reverse proxy in front of application servers.

## 1. Forward Proxy

A forward proxy sits between the client and the internet.
```
User
  │
  ▼
Forward Proxy
  │
  ▼
Google.com
```
The website sees:
```
Proxy IP
```
instead of:
```
User IP
```

**A VPN server is a common example of a forward proxy-like architecture because it represents clients when communicating with external servers.**
```
Client A ─┐
Client B ─┼──► VPN Server ───► Website/API Server
Client C ─┘
```
For example:
```
Laptop A (India)
Laptop B (India)
Laptop C (India)
        │
        ▼
   VPN Server
   (Singapore)
        │
        ▼
   google.com
```
Google sees:
```
VPN Server IP
```
instead of:
```
Laptop A IP
Laptop B IP
Laptop C IP
```

**Purpose**
- Hide client identity
- Access restricted websites
- Content filtering
- Corporate internet control
- Anonymity

**Example**

Office network:
```
Employee PC
    │
    ▼
Corporate Proxy
    │
    ▼
Internet
```

**Company can:**
- Block YouTube
- Block Facebook
- Log browsing activity
- Cache websites

**Forward Proxy Request Flow**
```
Browser
  │
  ▼
Proxy Server
  │
  ▼
api.example.com
```
Website thinks:
```
Request came from Proxy not from the actual user.
```

## 2. Reverse Proxy

A reverse proxy sits in front of servers.
```
User
  │
  ▼
Reverse Proxy
  │
  ▼
Backend Servers
```
Client doesn't know which server handled the request.

**Example: Nginx Reverse Proxy**
```
Internet Users
        │
        ▼
      Nginx
        │
 ┌──────┼──────┐
 ▼      ▼      ▼
App1   App2   App3
```
Nginx decides:
```
Request 1 → App1
Request 2 → App2
Request 3 → App3
```

## Reverse Proxy Responsibilities
**Load Balancing**
```
Client
   │
   ▼
 Nginx
   │
 ┌─┼─┐
 ▼ ▼ ▼
S1 S2 S3
```

**SSL Termination**

Instead of:
```
Client
   │ HTTPS
   ▼
Node.js
```
Use:
```
Client
   │ HTTPS
   ▼
Nginx
   │ HTTP
   ▼
Node.js
```
Nginx handles certificates.


**Caching**
```
Client
   │
   ▼
Nginx Cache
   │
   ▼
Node.js
```
Second request may never reach Node.js.

**Security**

Hide internal servers:
```
Internet
   │
   ▼
Nginx
   │
   ▼
10.0.0.5
10.0.0.6
10.0.0.7
```
Users never see internal IPs.

## Real Banking Architecture
```
Customer Browser
        │
        ▼
      Nginx
 (Reverse Proxy)
        │
 ┌──────┼────────┐
 ▼      ▼        ▼
Auth   API     Payments
Svc    Svc      Svc
        │
        ▼
      Redis
        │
        ▼
   PostgreSQL
```

Nginx performs:
- SSL termination
- Rate limiting
- Load balancing
- API routing
- DDoS protection

## Forward Proxy Diagram (Represents the Client)
```
┌──────────┐
│  Client  │
│ Browser  │
└────┬─────┘
     │
     ▼
┌──────────────┐
│ Forward Proxy│
│ (Squid/VPN)  │
└────┬─────────┘
     │
     ▼
┌──────────────┐
│  Internet    │
│ Google/API   │
└──────────────┘
```

**What the Internet Sees**
```
Client IP:      192.168.1.10
Proxy IP:       203.0.113.50

Google sees:
203.0.113.50
```
```
Client ──► Proxy ──► Website

Website sees Proxy IP
Website does NOT see Client IP
```

**Corporate Network Example**
```
Employees
    │
    ▼
┌──────────────┐
│Forward Proxy │
│Content Filter│
└──────┬───────┘
       │
       ▼
    Internet
```
Can:  
✓ Block YouTube  
✓ Block Facebook  
✓ Log Traffic  
✓ Cache Websites  

## Reverse Proxy Diagram (Represents the Server)
```
                Internet Users
                       │
                       ▼
              ┌────────────────┐
              │ Reverse Proxy  │
              │     Nginx      │
              └───────┬────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │ App-1   │ │ App-2   │ │ App-3   │
    │ Node.js │ │ Node.js │ │ Node.js │
    └─────────┘ └─────────┘ └─────────┘
```

**What the Client Sees**
```
User sees:
https://api.bank.com

User does NOT know:
10.0.0.5
10.0.0.6
10.0.0.7
```
```
Client ──► Nginx ──► Backend Servers

Client sees Nginx
Client does NOT see Servers
```



