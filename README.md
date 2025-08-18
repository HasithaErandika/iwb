# NomadPage - iwb25-075-octopipers

NomadPage is a website that helps people who work remotely and travel to Sri Lanka. It helps them find online jobs, places to work, and meet other people. It also has useful tools like currency conversion. This was built for the Innovate with Ballerina 25 competition to help digital nomads work and live easily in Sri Lanka.

## Tech Stack

**Frontend:** Next.js 15, Tailwind CSS, Shadcn/ui

**Backend:** Ballerina, PostgreSQL, AWS S3

**Additional Services:** Flask, BeautifulSoup4 (for news scraping functionality)

## Prerequisites

Before you start, make sure you have these installed on your computer:

- **Node.js v20+ and npm** 
- **Ballerina** 
- **Python** 
- **PostgreSQL**
- **Asgardeo Account**
- **AWS Account(to get access to S3)**

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/chamals3n4/iwb25-075-octopipers.git
cd iwb25-075-octopipers
```

### 2. Set Up the Frontend (Next.js)

```bash
cd webapp
npm install
```

#### Set Up Asgardeo Authentication

We use WSO2 Asgardeo for authentication. Follow these steps:

1. Go to [console.asgardeo.io](https://console.asgardeo.io) and sign in
2. Create a new Next.js application
3. Get the following values from your Asgardeo app:
   - Client ID
   - Client Secret
   - Organization Name
   - Application Name

For detailed instructions, refer to the [official Asgardeo documentation](https://wso2.com/asgardeo/docs/).

Create a file called `.env.local` in the `webapp` folder and add your settings:

```env
AUTH_SECRET=your-secret-key

ASGARDEO_CLIENT_ID=your-client-id
ASGARDEO_CLIENT_SECRET=your-client-secret
AUTH_ASGARDEO_ISSUER="https://api.asgardeo.io/t/{yourorgname}/oauth2/token"

NEXT_PUBLIC_AUTH_ASGARDEO_LOGOUT_URL="https://api.asgardeo.io/t/{yourorgname}/oidc/logout"
NEXT_PUBLIC_AUTH_ASGARDEO_POST_LOGOUT_REDIRECT_URL="http://localhost:3000/auth/sign-out"
```

### 3. Set Up Prerequisites for Backend

Before setting up the backend, you need to configure these services:

#### PostgreSQL Database

1. Install PostgreSQL on your computer or use a cloud service ( i prefer to go with supabase its soo easy btw)
2. Create a new database for the project
3. Copy and paste the contents of `service/resources/schema.sql` into your PostgreSQL database to create the required tables

#### AWS S3

1. Create an AWS account if you don't have one
2. Create an S3 bucket for file storage
3. Create an IAM user with S3 access
4. Get your AWS Access Key ID and Secret Access Key

#### Perplexity API

1. Go to [perplexity.ai](https://perplexity.ai) and sign up
2. Get your API key from the dashboard
3. This is used for AI-powered feature

#### Weather API

1. Go to [openweathermap.org](https://openweathermap.org) and sign up
2. Get your API key
3. This is used for weather information

#### Create Config.toml

Create a file called `Config.toml` in the `service` folder and add your keys and configuration values from the PostgreSQL, AWS S3, Perplexity API, and Weather API services:

```toml
[service.utils]
dbHost = "your-database-host"
dbUser = "your-database-username"
dbPassword = "your-database-password"
dbPort = 5432
dbName = "your-database-name"
accessKeyId = "your-aws-access-key"
secretAccessKey = "your-aws-secret-key"
region = "your-aws-region"
bucketName = "your-s3-bucket-name"

[service.city_guide]
perplexityApiKey = "your-perplexity-api-key"

[service.tools]
openWeatherApi = "your-openweathermap-api-key"
```

### 4. Set up the backend (Ballerina)

```bash
cd service
bal run
```

### 5. Set up the news scrapper

```bash
cd newswired
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

## Running the Application

### Start the Frontend

```bash
cd webapp
npm run dev
```

The webapp will be available at `http://localhost:3000`

### Start the Backend

```bash
cd service
bal run
```

The Ballerina service will start on the port `8080`

### Start the News Scraper

```bash
cd newswired
python app.py
```

The news scraper will run on `http://localhost:5000/latest-news`

## Project Structure

```
iwb/
├── webapp/          # Next.js frontend
├── service/         # Ballerina backend 
├── newswired/       # news scraper
```

## Features

- **Remote Job Search** - Find and apply for online jobs
- **Co-working Spaces** - Find places to work
- **Meetups** - Connect with local groups and events and chat inside realtime
- **City Guide** - Find places to visit and things to do in srilanka
- **The Calendar** - Lets people add contribute to calendar with locations and other details
- **Utility Tools** - Currency conversion, weather info, and more ( see on the home page of the dashboard)
