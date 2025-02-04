# Next.js Event Ticket Marketplace

## Overview
The **Next.js Event Ticket Marketplace** is a modern web application for buying and selling event tickets securely and efficiently. Built with **Next.js, React, Redis, Firebase, and TypeScript**, this platform provides a seamless experience for users looking to purchase or sell tickets online.

## Features
- **Buy & Sell Tickets:** Users can list tickets for sale or purchase available tickets.
- **Real-time Availability:** Ensures up-to-date ticket availability with Redis caching.
- **Secure Authentication:** Firebase authentication for secure user sign-in.
- **Fast Performance:** Optimized API calls and server-side rendering using Next.js.
- **Scalable Storage:** Firebase Firestore manages event and user data efficiently.

## Technologies Used
- **Next.js & React** - Frontend framework for fast and dynamic UI.
- **Redis** - Caching system for real-time ticket availability updates.
- **Firebase** - Authentication and database for secure and scalable user data management.
- **TypeScript** - Ensures type safety and maintainability.

## Benefits Over Conventional Methods
- **Free to Use:** No platform fees, making ticket transactions cost-effective.
- **Secure:** Firebase authentication ensures only verified users can transact.
- **Seamless Usage:** Runs on the web without requiring any app downloads.

## Getting Started
### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or later)
- Redis Server
- Firebase Project Setup

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/nextjs-ticket-marketplace.git
   cd nextjs-ticket-marketplace
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in a `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REDIS_URL=redis://localhost:6379
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- **Create an Account:** Sign up using Firebase authentication.
- **List a Ticket:** Enter event details and set your price.
- **Buy a Ticket:** Browse available tickets and purchase securely.
- **Manage Orders:** View ticket history and transactions in your dashboard.

## Deployment
To deploy the app on **Vercel**, run:
```sh
vercel
```
Follow the prompts to complete deployment.

## Contributing
Contributions are welcome! Please submit a pull request with relevant changes.

## License
This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)**. You are free to share and adapt the material but cannot sell modified copies commercially. For full license details, visit [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
