# SOFA-SOCIETY

A full-stack ecommerce platform for furniture shopping built with Next.js and Medusa.

## Overview

The purpose of this task was to mimic a full-stack ecommerce platform that allows users to add sofa's into their carts and display the number of items in the cart.

## Project Structure

```
sofa-society/
├── medusa-backend/          # Medusa ecommerce backend
│   ├── src/
│   │   ├── scripts/        # Seed scripts for data management
│   ├── medusa-config.ts    # Medusa configuration
│   └── package.json
└── frontend/               # Next.js storefront
```

## Getting Started

### Prerequisites

- **Node.js**: 16+ or higher
- **Package Manager**: npm or yarn
- **Database**: PostgreSQL (configured in `.env`)
- **Redis**: For caching and sessions (not required for testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/EziKielCroat/sofa-society
cd sofa-society
```

2. Install backend dependencies:
```bash
cd medusa-backend
npm install
```

3. Set up your environment variables:
```bash
touch .env

NODE_ENV=production
MEDUSA_API_KEY=SUPER_SECRET_KEY_HERE

ADMIN_CORS=http://localhost:3000 // Replace with your own link to frontend and remove comment
AUTH_CORS=http://localhost:3000
STORE_CORS=http://localhost:3000

REDIS_URL=redis://localhost:6379

JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
DATABASE_URL=postgres://postgres:sudo@localhost/medusa-medusa-backend // Replace with your own and remove comment

MEDUSA_BACKEND_URL=http://localhost:9000
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Set up your environment variables:
```bash
touch .env

NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_REGION_ID=Replace with Region ID you get when registering (I had a lot of issues with this part, cannot make any recommendations, look at the attach-region-to-channel.ts for ideas)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY=Publishable API key goes here

```

### Usage

Start the Medusa backend:
```bash
cd medusa-backend
npm run dev
```
Start the NextJS Storefront:
```bash
cd frontend
npm run dev
```


### Seeding Data:
Note: There was a lot of issues with this part! Below are exact commands as I got it to work, because Medusas JS SDK lacks documentation and details on the seeding and Custom CLI scripts...
This part is necesarry if you wish to see the products correctly. MAKE SURE THE BACKEND IS RUNNING BEFORE DOING THIS PART!!!!

```bash
cd medusa-backend
npx medusa exec ./src/scripts/product-seed.ts
npx medusa exec ./src/scripts/add-stock.ts
```

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Acknowledgments

Built with Medusa, Next.js, and React. Special thanks to the Medusa community for excellent documentation and support.

Zadatak sam ocijenio kao umjereno zahtjevan, iako svakako postoje dijelovi koje bi se moglo dodatno unaprijediti.
Najveći izazov bilo mi je prvo povezivanje s Medusa SDK-om, posebice kod dodavanja regija i rada s košaricama, što je u početku bilo pomalo zbunjujuće zbog nedostatka kvalitetne dokumentacije.
Procjenjujem da bi za potpuno ispoliranu verziju projekta, s implementiranim TailwindCSS-om, bilo potrebno još otprilike 5–10 sati rada.
Bez obzira na to hoće li se ovaj zadatak priznati, planiram ga nastaviti dorađivati kako bi ostao kao kvalitetan primjer u mom GitHub profilu.
