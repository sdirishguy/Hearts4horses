# Hearts4Horses 🐎

A comprehensive equestrian training and lesson management platform built with Next.js, Node.js, and PostgreSQL.

## Features

### 🏠 Public Website
- **Homepage** - Compelling hero section with call-to-action
- **Services & Pricing** - Dynamic lesson types and package pricing
- **Horse Profiles** - Individual horse information and availability
- **Gallery** - Photo and video showcase
- **Events** - Upcoming camps, shows, and special events
- **Contact** - Contact form and location information

### 👨‍🎓 Student Portal
- **Registration & Intake** - New student onboarding with e-signatures
- **Lesson Booking** - Real-time availability calendar
- **Package Management** - View and purchase lesson packages
- **Progress Tracking** - Instructor notes and skill development
- **Payment History** - Transaction records and receipts

### 🏢 Admin Dashboard
- **Calendar Management** - Create recurring lesson templates
- **Horse Management** - Horse profiles, health records, availability
- **Student Management** - Student profiles, progress tracking
- **Content Management** - Upload photos, update pricing, manage testimonials
- **Reports** - Revenue, attendance, and utilization analytics

### 💳 E-commerce
- **Stripe Integration** - Secure payment processing
- **Lesson Packages** - Pre-paid lesson bundles
- **Merchandise** - Branded products and gear
- **Gift Certificates** - Digital gift cards

### 🔧 Technical Features
- **Responsive Design** - Mobile-first approach
- **Real-time Scheduling** - Dynamic availability updates
- **Email/SMS Notifications** - Automated reminders
- **Weather Integration** - Weather-aware scheduling
- **Social Media Integration** - Instagram/Facebook feeds

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form management
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **Stripe** - Payment processing

### Infrastructure
- **AWS Lightsail** - Hosting platform
- **NGINX** - Reverse proxy
- **Let's Encrypt** - SSL certificates
- **Cloudinary** - Image/video storage
- **Twilio** - SMS notifications
- **Mailchimp** - Email marketing

## Security Considerations

### 🔒 Critical Security Measures
- **Environment Variables**: Never commit `.env` files. Use `.env.example` as templates.
- **JWT Secrets**: Use strong, unique JWT secrets. Never use fallback secrets.
- **Database Credentials**: Rotate database passwords regularly.
- **API Keys**: Store sensitive API keys server-side only.
- **Rate Limiting**: Auth routes are rate-limited to prevent brute force attacks.
- **CORS**: Configured to allow only trusted origins.
- **Input Validation**: All inputs validated with Zod schemas.
- **Error Logging**: Sensitive data is sanitized before logging.

### 🛡️ Authentication & Authorization
- JWT tokens with secure configuration
- Role-based access control (RBAC)
- Server-side route protection
- Middleware guards for sensitive endpoints

### 🔐 Data Protection
- Password hashing with bcrypt
- HTTPS enforcement in production
- Secure cookie configuration
- Input sanitization and validation

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hearts4horses
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

#### Backend (.env in apps/api/)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hearts4horses"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Optional Integrations
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
MAILCHIMP_API_KEY="your-api-key"
OPENWEATHER_API_KEY="your-api-key"
```

#### Frontend (.env.local in apps/web/)
```bash
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 4. Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with initial data
npm run db:seed
```

### 5. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:web    # Frontend on http://localhost:3000
npm run dev:api    # Backend on http://localhost:4000
```

## Project Structure

```
hearts4horses/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   └── lib/           # Utilities and helpers
│   └── api/                # Express.js backend
│       ├── src/
│       │   ├── routes/     # API routes
│       │   ├── middleware/ # Express middleware
│       │   ├── lib/        # Database and utilities
│       │   └── scripts/    # Database seeds
│       └── prisma/         # Database schema
├── packages/
│   └── shared/             # Shared TypeScript types
└── package.json            # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Public
- `GET /api/v1/public/horses` - List horses
- `GET /api/v1/public/services` - Lesson types and pricing
- `GET /api/v1/public/gallery` - Media gallery
- `GET /api/v1/public/testimonials` - Customer testimonials
- `POST /api/v1/public/contact` - Contact form submission

### Student Portal
- `GET /api/v1/student/slots` - Available lesson slots
- `POST /api/v1/student/bookings` - Book a lesson
- `GET /api/v1/student/bookings` - Student's bookings
- `GET /api/v1/student/packages` - Student's packages

### Admin
- `GET /api/v1/admin/horses` - Manage horses
- `POST /api/v1/admin/templates` - Create lesson templates
- `POST /api/v1/admin/slots/generate` - Generate availability slots
- `GET /api/v1/admin/students` - Manage students
- `POST /api/v1/admin/media/upload` - Upload content

### Payments
- `POST /api/v1/payments/packages/checkout` - Create Stripe checkout
- `POST /api/v1/webhooks/stripe` - Stripe webhook handler

## Deployment

### AWS Lightsail Setup

1. **Create Lightsail Instance**
   ```bash
   # Ubuntu 22.04 LTS
   # 2GB RAM, 1 vCPU minimum
   ```

2. **Install Dependencies**
   ```bash
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs nginx
   sudo npm i -g pm2
   ```

3. **Clone and Build**
   ```bash
   cd /var/www
   git clone <repository-url> hearts4horses
   cd hearts4horses
   npm install
   npm run build
   ```

4. **Set Up Environment**
   ```bash
   # Copy environment files
   cp apps/api/env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   
   # Edit with your actual values
   nano apps/api/.env
   nano apps/web/.env.local
   ```

5. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

6. **Start Services**
   ```bash
   # Start API
   cd apps/api
   pm2 start "npm run start" --name hearts-api
   
   # Start Web
   cd ../web
   pm2 start "npm run start" --name hearts-web
   
   pm2 save
   pm2 startup
   ```

7. **NGINX Configuration**
   ```nginx
   # /etc/nginx/sites-available/hearts4horses
   server {
     listen 80;
     server_name hearts4horses.com www.hearts4horses.com;
     
     location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   
   server {
     listen 80;
     server_name api.hearts4horses.com;
     
     location / {
       proxy_pass http://127.0.0.1:4000;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   ```

8. **SSL Certificate**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d hearts4horses.com -d www.hearts4horses.com
   sudo certbot --nginx -d api.hearts4horses.com
   ```

## Customization

### Colors
The color palette is defined in `apps/web/tailwind.config.ts`:
- **Barn Brown** (#4B352A) - Primary color
- **Copper** (#CA7842) - Accent color  
- **Sage** (#B2CD9C) - Muted color
- **Butter** (#F0F2BD) - Light accent

### Content
- Update horse information in the admin dashboard
- Modify lesson types and pricing via the admin interface
- Upload photos and videos through the media manager
- Customize testimonials and events

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Hearts4Horses** - Making equestrian dreams come true, one lesson at a time. 🐎✨
