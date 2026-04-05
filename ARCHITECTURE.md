# 📐 ClickBazaar System Architecture

**ClickBazaar** is a full-stack e-commerce platform designed for security, scalability, and excellent user experience.

---

## 🏗️ System Overview

High-level architecture with all components:

```mermaid
graph TB
    subgraph "🎨 Frontend (React + Vite + Tailwind)"
        A[App.tsx<br/>Main Component]
        B[Pages<br/>Shopping/Admin/Chat]
        C[Components<br/>UI Elements]
        D[Services Layer<br/>api.ts + geminiService.ts]
    end

    subgraph "🚀 Backend (Node.js + Express)"
        E[Express Server<br/>Port 4100]
        F[JWT Auth Middleware<br/>Token Verification]
        G[API Routes<br/>/api/* endpoints]
        H[Email Service<br/>SMTP + Templates]
        I[AI Orchestration<br/>Gemini + Groq]
    end

    subgraph "🗄️ SQLite Database"
        J[(Users Table)]
        K[(Orders Table)]
        L[(Sessions Table)]
        M[(Audit Logs)]
        N[(Products<br/>Auto-seeded)]
    end

    subgraph "📧 External Services"
        O[Gmail SMTP<br/>Email Delivery]
        P[Google Gemini<br/>AI Chat/Generation]
        Q[Groq API<br/>AI Chat/Generation]
    end

    %% Frontend to Backend connections
    D -->|HTTP/HTTPS<br/>API Calls| G
    D -->|JWT Tokens| F

    %% Backend internal connections
    E --> F
    F --> G
    G -->|Database Queries| J
    G -->|Database Queries| K
    G -->|Database Queries| L
    G -->|Database Queries| M
    G -->|Database Queries| N

    %% Email connections
    H -->|SMTP| O
    G -->|Email Requests| H

    %% AI connections
    I -->|API Calls| P
    I -->|API Calls| Q
    G -->|AI Requests| I

    %% User interactions
    A -->|User Actions| D
    B -->|Page Navigation| A
    C -->|UI Updates| B

    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000000
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000000
    classDef database fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px,color:#000000
    classDef external fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000000

    class A,B,C,D frontend
    class E,F,G,H,I backend
    class J,K,L,M,N database
    class O,P,Q external
```

---

## 📧 Email System Flow (3 Features)

```mermaid
graph TD
    subgraph "👤 User Actions"
        A1[User Signs Up]
        A2[User Forgets Password]
        A3[User Submits Support Ticket]
    end

    subgraph "🚀 Backend Processing"
        B1[Generate 6-digit OTP]
        B2[Send OTP Email]
        B3[Validate OTP]
        B4[Send Recovery Email]
        B5[Send Support Email to Admin]
    end

    subgraph "📧 Gmail SMTP Service"
        C1[Connect to Gmail SMTP]
        C2[Send HTML Email]
        C3[Deliver to Inbox]
    end

    subgraph "📬 Email Delivery"
        D1[OTP Code to User]
        D2[Recovery Link to User]
        D3[Support Message to Admin]
    end

    A1 --> B1
    B1 --> B2
    B2 --> C1
    C1 --> C2
    C2 --> C3
    C3 --> D1

    A2 --> B4
    B4 --> C1
    C1 --> C2
    C2 --> C3
    C3 --> D2

    A3 --> B5
    B5 --> C1
    C1 --> C2
    C2 --> C3
    C3 --> D3

    %% Styling
    classDef user fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000000
    classDef backend fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000000
    classDef smtp fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000000
    classDef delivery fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#000000

    class A1,A2,A3 user
    class B1,B2,B3,B4,B5 backend
    class C1,C2,C3 smtp
    class D1,D2,D3 delivery
```

---

## 🔐 Authentication & Security Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as 🎨 Frontend
    participant B as 🚀 Backend
    participant DB as 🗄️ SQLite DB
    participant E as 📧 Gmail SMTP

    %% Registration Flow
    rect rgb(240, 248, 255)
        U->>F: 1. Fill signup form
        F->>B: 2. POST /api/register/send-otp
        B->>DB: 3. Check email exists
        alt Email exists
            B-->>F: ❌ "Email already registered"
        else New email
            B->>B: 4. Generate 6-digit OTP
            B->>E: 5. Send OTP email
            E-->>U: 6. User receives OTP
            U->>F: 7. Enter OTP + password
            F->>B: 8. POST /api/register
            B->>B: 9. Validate OTP & password
            B->>B: 10. Hash password (bcrypt)
            B->>DB: 11. Create user account
            B-->>F: 12. ✅ Success + JWT token
            F->>F: 13. Store token locally
        end
    end

    %% Login Flow
    rect rgb(255, 248, 220)
        U->>F: 14. Fill login form
        F->>B: 15. POST /api/login
        B->>DB: 16. Verify email + password hash
        alt Valid credentials
            B->>B: 17. Generate JWT token
            B-->>F: 18. ✅ Return token
            F->>F: 19. Store token
        else Invalid
            B-->>F: ❌ "Invalid credentials"
        end
    end

    %% Protected API Request
    rect rgb(240, 255, 240)
        F->>B: 20. API request + JWT header
        B->>B: 21. Verify JWT signature
        alt Valid token
            B->>DB: 22. Fetch user data
            B-->>F: 23. ✅ Return data
        else Invalid/expired
            B-->>F: ❌ 401 "Unauthorized"
            F->>F: 24. Redirect to login
        end
    end
```

---

## 🔨 Backend API Routes

### **Authentication**  

- `POST /api/register/send-otp` - Send registration OTP email
- `POST /api/register` - Complete registration (requires OTP)
- `POST /api/login` - Authenticate user, return JWT
- `POST /api/logout` - Clear session
- `POST /api/forgot-password` - Send password reset OTP
- `POST /api/verify-otp` - Verify password reset code
- `POST /api/reset-password` - Set new password

### **User (Protected by JWT)**  

- `GET /api/me` - Get current user profile
- `PUT /api/profile` - Update profile info
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

### **Admin Only (Requires JWT + Admin Role)**  

- `GET /api/admin/users` - List all users
- `GET /api/admin/orders` - List all orders
- `POST /api/admin/users/:id/role` - Change user role
- `POST /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/audit` - View system audit logs
- `GET /api/admin/sessions` - View active sessions

### **Support**  

- `POST /api/support/inquiry` - Submit support ticket (sends email to admin)

### **AI Services**  

- `POST /api/chat` - Chat with ClickBot (uses Gemini/Groq)
- `POST /api/genai/description` - Generate product descriptions
- `POST /api/genai/recommendations` - Get product recommendations

---

## 🛡️ Security Implementation

| Feature | Technology | How It Works |
| --------- | ----------- | ------------- |
| **Password Storage** | Bcryptjs (10 rounds) | Passwords hashed before database storage |
| **Session Management** | JWT (7-day tokens) | Stateless auth, expires after 7 days |
| **Email Verification** | Gmail SMTP + OTP | 6-digit code (10-min expiry) for signup/password reset |
| **Role-Based Access** | Middleware checks | Users can only access their own data; admins can access all |
| **Admin Protection** | Secret admin key | Extra verification when setting admin role |
| **Security Headers** | Helmet.js | Protects against XSS, CSRF, clickjacking |
| **CORS** | Express CORS | Prevents unauthorized cross-origin requests |
| **Password Rules** | Regex validation | Enforced on signup: 8+ chars, uppercase, lowercase, number, special |
| **Duplicate Prevention** | Email validation | Can't signup twice with same email |
| **Audit Logging** | Database logs | All admin actions recorded with timestamp |

---

## 📦 Database Schema

**Users Table**  

```sql
- id (PRIMARY KEY)
- name (string)
- email (UNIQUE, LOWERCASE)
- password_hash (bcrypt hash)
- role (customer | admin)
- membership_tier (string)
- wishlist (JSON array)
- cart (JSON array)
- created_at (timestamp)
```

**Orders Table**  

```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- items (JSON array)
- total_price (decimal)
- status (pending | processing | shipped | delivered)
- created_at (timestamp)
- updated_at (timestamp)
```

**Sessions Table**  

```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- created_at (timestamp)
```

---

## 🔄 Complete Data Flow Architecture

```mermaid
flowchart TD
    subgraph "🌐 User Layer"
        U1[👤 Customer]
        U2[👨‍💼 Admin]
    end

    subgraph "🎨 Presentation Layer"
        F1[React App<br/>App.tsx]
        F2[Pages<br/>Shopping/Cart/Admin]
        F3[Services<br/>api.ts + AI services]
    end

    subgraph "🚀 Application Layer"
        B1[Express Server<br/>index.js]
        B2[JWT Middleware<br/>Auth verification]
        B3[API Routes<br/>/api/*]
        B4[Business Logic<br/>User/Order management]
    end

    subgraph "📧 Communication Layer"
        E1[Email Service<br/>emailServiceSMTP.js]
        E2[AI Orchestration<br/>Gemini + Groq]
    end

    subgraph "🗄️ Data Layer"
        D1[SQLite Database<br/>db.js]
        D2[Users Table]
        D3[Orders Table]
        D4[Sessions Table]
        D5[Audit Logs]
    end

    subgraph "🔗 External Services"
        EX1[Gmail SMTP]
        EX2[Google Gemini API]
        EX3[Groq API]
    end

    %% User interactions
    U1 -->|Browse/Shop| F1
    U2 -->|Admin Tasks| F1

    %% Frontend flow
    F1 -->|UI Logic| F2
    F2 -->|API Calls| F3
    F3 -->|HTTP Requests| B1

    %% Backend processing
    B1 -->|Route Requests| B3
    B3 -->|Auth Check| B2
    B2 -->|Business Logic| B4
    B4 -->|Database Operations| D1

    %% Database relationships
    D1 -->|Store/Retrieve| D2
    D1 -->|Store/Retrieve| D3
    D1 -->|Store/Retrieve| D4
    D1 -->|Store/Retrieve| D5

    %% External communications
    E1 -->|Send Emails| EX1
    E2 -->|AI Queries| EX2
    E2 -->|AI Queries| EX3

    %% Service connections
    B4 -->|Email Tasks| E1
    B4 -->|AI Tasks| E2

    %% Styling
    classDef user fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000000
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000000
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000000
    classDef services fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000000
    classDef database fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px,color:#000000
    classDef external fill:#ffebee,stroke:#b71c1c,stroke-width:2px,color:#000000

    class U1,U2 user
    class F1,F2,F3 frontend
    class B1,B2,B3,B4 backend
    class E1,E2 services
    class D1,D2,D3,D4,D5 database
    class EX1,EX2,EX3 external
```

---

## 🔄 Data Flow Examples

### **Complete User Registration Flow**

```mermaid
flowchart LR
    subgraph "🎨 Frontend"
        F1[User fills form]
        F2[Validate password strength]
        F3[Send OTP request]
        F4[User enters OTP]
        F5[Complete registration]
    end

    subgraph "🚀 Backend"
        B1[Check email exists]
        B2[Generate OTP]
        B3[Send OTP email]
        B4[Validate OTP]
        B5[Hash password]
        B6[Create user record]
        B7[Generate JWT]
    end

    subgraph "🗄️ Database"
        D1[Users table]
    end

    subgraph "📧 Email"
        E1[Gmail SMTP]
    end

    F1 --> F2
    F2 --> F3
    F3 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> E1
    E1 --> F4
    F4 --> F5
    F5 --> B4
    B4 --> B5
    B5 --> B6
    B6 --> D1
    D1 --> B7
    B7 --> F5

    classDef frontend fill:#e1f5fe,stroke:#01579b
    classDef backend fill:#f3e5f5,stroke:#4a148c
    classDef database fill:#e8f5e8,stroke:#1b5e20
    classDef email fill:#fff3e0,stroke:#e65100

    class F1,F2,F3,F4,F5 frontend
    class B1,B2,B3,B4,B5,B6,B7 backend
    class D1 database
    class E1 email
```

### **Shopping Cart to Order Flow**

```mermaid
flowchart TD
    A[👤 User adds to cart] --> B[Frontend stores in localStorage]
    B --> C[User clicks checkout]
    C --> D[Frontend validates cart]
    D --> E[POST /api/orders]
    E --> F[Backend validates JWT]
    F --> G[Backend creates order record]
    G --> H[Database saves order]
    H --> I[Backend sends confirmation email]
    I --> J[Gmail SMTP delivers email]
    J --> K[User receives confirmation]
    K --> L[Order status: pending]

    classDef frontend fill:#e1f5fe,stroke:#01579b
    classDef backend fill:#f3e5f5,stroke:#4a148c
    classDef database fill:#e8f5e8,stroke:#1b5e20
    classDef email fill:#fff3e0,stroke:#e65100

    class A,B,C,D frontend
    class E,F,G,I backend
    class H database
    class J email
    class K,L frontend
```

### **AI Chat Interaction Flow**

```mermaid
flowchart LR
    A[👤 User types message] --> B[Frontend ClickBot component]
    B --> C[Send to api.ts service]
    C --> D[POST /api/chat]
    D --> E[Backend AI orchestration]
    E --> F{Choose AI service}
    F -->|Gemini| G[Query Google Gemini API]
    F -->|Groq| H[Query Groq API]
    G --> I[Receive AI response]
    H --> I
    I --> J[Backend formats response]
    J --> K[Return to frontend]
    K --> L[Display in chat UI]

    classDef frontend fill:#e1f5fe,stroke:#01579b
    classDef backend fill:#f3e5f5,stroke:#4a148c
    classDef ai fill:#fff3e0,stroke:#e65100

    class A,B,C frontend
    class D,E,J backend
    class F,G,H,I ai
    class K,L frontend
```

---

## ⚡ Performance Considerations

- **JWT Stateless**: No session database needed, scales horizontally
- **SQLite Local**: Fast for development; use PostgreSQL for production
- **Async Email**: Email sending doesn't block API response
- **Caching**: Frontend caches user data in React state
- **Compression**: Gzip enabled on Express responses

---

### 🔗 Quick Links

[🏠 Back to README](./README.md) | [📜 Instructions](./INSTRUCTIONS.md) | [🗺️ User Guide](./USER_GUIDE.md) | [⚖️ License](./LICENSE)

---

© 2026 ClickBazaar. Built with security and simplicity in mind.
