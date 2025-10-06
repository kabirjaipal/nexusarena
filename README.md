## Jaipal Esports

Build a full-stack, production-ready eSports tournament registration platform for games like PUBG and Free Fire (assume only legal games are selectable in India). Use the following stack:

- Frontend: Next.js (latest), Tailwind CSS, shadcn/ui for components, React-Icons.
- Backend: Next.js API routes, Prisma ORM with PostgreSQL.
- Payment: Integrate the Razorpay payment gateway (best for India, easy to implement, supports UPI/cards/wallets and payouts).

## Essential Features

1. Landing/Home page
   - Modern Esports Landing page
   - Display upcoming and featured tournaments
   - Highlights for PUBG/Free Fire—show game legality status

2. Auth
   - Sign up/in with email/password using NextAuth.js
   - Optional: OAuth with Google and discord

3. User Dashboard
   - View joined tournaments, winnings, payment history
   - Personal profile and KYC upload page

4. Tournament Management
   - List all tournaments per game (title, entry fee, prize, date/time, rules)
   - Register/buy-in through integrated payment gateway (Razorpay)
   - Auto-register user with transaction confirmation
   - Registration closes at capacity or pre-set time
   - Admin can create, edit, and delete tournaments via an /admin route

5. Player Matchmaking/Bracket
   - Show user which match/team they are assigned to
   - Display schedules, match details

6. Prize Payout
   - Admin uploads results
   - Winners can receive payouts via Razorpay payouts (mark payout as done, no illegal betting/withdrawal features)

7. Notifications
   - In-app notifications for match times, results, rewards

8. Security/Compliance
   - Enforce 18+ on signup
   - Add legal disclaimer and privacy policy
   - Don’t allow tournaments for banned games (block Free Fire if illegal)
   - Admin panel secured by RBAC (role-based access)

9. Responsive UI
   - Use Tailwind + shadcn/ui for mobile-first, accessible design

## Instructions

- Scaffold project structure and database schema in Prisma: Users, Tournaments, Registrations, Matches, Payments, Payouts, Notifications, User KYC.
- Use best colors for this site and set color variable in gloabls.css like primary secondary etc so we can change color later in css file and it affect in whole site
- Each Table in database should have prefixs like m_ , p_ , t_ etc............
- Integrate Razorpay for payments; provide test/demo keys and stub payout admin actions.
- Clearly document all env variables and config details.
- Cover full CRUD in admin: tournaments, matches, payments, users.
- Show sensible error/empty/loading states with shadcn/ui.
- Include dummy legal text, and sample documentation for deployment (Vercel/ any cloud).
- Use React-Icons for clear status and action cues throughout.
- Provide working seed data and/or a script for easy local setup.
- always use shadcn commands to get component don't code it mannually 

Deliver fully working code, cleanly structured, that can be deployed right away, with a README for setup and deployment, and brief in-code comments for custom logic.
