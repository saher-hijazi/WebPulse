# WebPulse - Website Performance Monitoring Tool

WebPulse is a full-stack SaaS web application that allows users to register websites and monitor their performance using Google Lighthouse and Web Vitals metrics.

## Features

- **Website Registration**: Register websites to monitor their performance
- **Performance Dashboard**: View performance metrics and trends over time
- **Automated Scanning**: Schedule regular scans of your websites
- **Performance Metrics**: Track Lighthouse scores and Web Vitals
- **Recommendations**: Get actionable recommendations to improve website performance
- **Email Notifications**: Receive alerts when performance drops
- **Telegram Notifications**: Optional Telegram bot integration for alerts

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Recharts for data visualization
- Axios for API communication
- React Router for navigation

### Backend
- Node.js
- Express.js
- PostgreSQL database
- Sequelize ORM
- Google Lighthouse for performance audits
- Puppeteer for browser automation
- JWT for authentication
- Nodemailer for email notifications

### DevOps
- Docker and Docker Compose
- Nginx for serving the frontend
- Environment variables for configuration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL
- Docker and Docker Compose (optional)

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/webpulse.git
   cd webpulse
   ```

2. Set up the backend:
   ```
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. Set up the frontend:
   ```
   cd client
   npm install
   npm run dev
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Using Docker

1. Clone the repository:
   ```
   git clone[ https://github.com/saher-hijazi/WebPulse.git]
   cd webpulse
   ```

2. Create a `.env` file in the root directory with your configuration (use `.env.example` as a template).

3. Build and start the containers:
   ```
   docker-compose up -d
   ```

4. Access the application at http://localhost

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `PUT /api/auth/password` - Update user password

### Websites
- `GET /api/websites` - Get all websites for the authenticated user
- `GET /api/websites/:id` - Get a single website by ID
- `POST /api/websites` - Create a new website
- `PUT /api/websites/:id` - Update a website
- `DELETE /api/websites/:id` - Delete a website
- `POST /api/websites/:id/scan` - Run a scan for a website
- `GET /api/websites/:id/performance` - Get performance history for a website

### Scans
- `GET /api/scans/website/:websiteId` - Get all scans for a website
- `GET /api/scans/website/:websiteId/latest` - Get latest scan for a website
- `GET /api/scans/:id` - Get a single scan by ID
- `GET /api/scans/:id/recommendations` - Get recommendations for a scan

## Deployment

### Heroku
1. Create a new Heroku app
2. Add PostgreSQL add-on
3. Set environment variables in Heroku dashboard
4. Deploy using Heroku Git or GitHub integration

### VPS (Digital Ocean, AWS, etc.)
1. Set up a server with Docker and Docker Compose
2. Clone the repository
3. Create a `.env` file with your configuration
4. Run `docker-compose up -d`
5. Set up a domain and SSL certificate (optional)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals](https://web.dev/vitals/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
