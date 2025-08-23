# Hearts4Horses Deployment Readiness Checklist
*(Owner Questionnaire + Technical Prep)*

---

## 1. Business & Branding Information
- [ ] Business name & legal entity (full registered name, DBA if different)
- [ ] Logo & brand assets (high-res logo, favicon, social media icons)
- [ ] Brand colors (already chosen: #4B352A, #CA7842, #B2CD9C, #F0F2BD). Confirm final palette
- [ ] Fonts (Google Fonts or licensed fonts for site)
- [ ] High-quality images/videos (barn, horses, lessons, camps, shows)
- [ ] Written content (About, Services, Horses, Camps, Lessons, Staff bios)
- [ ] Pricing info (lesson rates, packages, camp fees)
- [ ] Testimonials (if available)

## 2. Domain & Hosting
- [ ] Domain registrar login (GoDaddy, Namecheap, etc.)
- [ ] Decide whether DNS will be managed at registrar or via AWS Route 53
- [ ] Confirm SSL setup preference (Let’s Encrypt via Lightsail or external)
- [ ] Confirm email provider (Google Workspace, Zoho, or domain registrar email)

## 3. E-Commerce / Payments
- [ ] Preferred payment processor (Stripe, PayPal, Square, etc.)
- [ ] Business bank account info (for payouts)
- [ ] Payment policies (refunds, cancellations, deposits)
- [ ] Products/services structure (single lessons, packages, camps, merchandise)
- [ ] Tax requirements (sales tax percentage, filing obligations)

## 4. Legal & Compliance
- [ ] Terms of Service drafted?
- [ ] Privacy Policy drafted?
- [ ] Liability waiver (for riders/parents — digital or paper?)
- [ ] Refund/cancellation policy for lessons/camps
- [ ] Accessibility compliance (ADA/WCAG readiness)

## 5. User Management
- [ ] Customer accounts or guest checkout only?
- [ ] Staff portal access: who should have access and what roles (Admin, Instructor, Volunteer)
- [ ] Staff scheduling integration (Google Calendar, iCal, etc.)

## 6. Marketing & Communication
- [ ] Email newsletter provider (Mailchimp, ConvertKit, etc.)
- [ ] Contact email address for customer inquiries
- [ ] Blog/news section?
- [ ] Social media integration (Instagram, Facebook feed embeds)
- [ ] SEO preferences (keywords, meta descriptions, alt text)
- [ ] Google Analytics / Search Console setup

## 7. Event & Camp Management
- [ ] List of annual events (summer, spring break, holiday camps)
- [ ] Max attendees per event (capacity limits)
- [ ] Age restrictions per program
- [ ] Online registration & payment for camps?
- [ ] Waitlist functionality required?

## 8. Technical Configurations
- [ ] GitHub repo connected for deployment pipeline?
- [ ] Environment variables (DB connection string, API keys, email service)
- [ ] Lightsail instance size (1GB/1CPU vs. 2GB/2CPU+)
- [ ] Backup & recovery plan (Lightsail snapshots)
- [ ] Monitoring/logging (CloudWatch, Sentry, LogRocket, etc.)

## 9. Content & Media Management
- [ ] Owner wants to upload photos/videos herself in future?
- [ ] Gallery organization (horses, lessons, camps, shows)
- [ ] Copyright usage rights confirmed (esp. for social media)

## 10. Launch & Ongoing Maintenance
- [ ] Confirm site launch date
- [ ] Marketing plan for launch (social posts, email blast)
- [ ] Who maintains site post-launch (owner, developer, contractor)
- [ ] Support/bug fix agreement
- [ ] Regular backups scheduled
