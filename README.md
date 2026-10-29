\# LogiFlow — Cloud Logistics and Supply Chain Management Platform



LogiFlow is a full-stack cloud logistics application for managing product inventory, orders, shipments, deliveries, and users.



\## Technology Stack



\- \*\*Frontend:\*\* React, Vite, Nginx

\- \*\*Backend:\*\* Java 21, Spring Boot

\- \*\*Database:\*\* MySQL 8.0

\- \*\*Containerization:\*\* Docker and Docker Compose



\## Project Structure



```text

logiflow-release/

├── backend/             # Spring Boot REST API

├── frontend/            # React frontend

├── docker-compose.yml   # Starts all application services

├── .env.example         # Environment variable template

├── .gitignore

└── README.md

```



\## Prerequisites



Install Docker Desktop and ensure Docker is running. Java, Node.js, and MySQL do not need to be installed separately to run the Dockerized application.



\## Run the Application



\### 1. Configure the environment



Copy `.env.example` to `.env` in the project root.



On Windows CMD:



```cmd

copy .env.example .env

```



Open `.env` and replace the placeholder with a strong database password. Do not upload `.env` to GitHub.



\### 2. Start the application



Run from the project root:



```cmd

docker compose up -d --build

```



Docker Compose builds and starts the frontend, backend, and MySQL database.



\### 3. Open the application



\- \*\*Frontend:\*\* http://localhost:5174

\- \*\*Backend API — Products:\*\* http://localhost:8082/api/products



\### 4. Check service status



```cmd

docker compose ps

```



\### 5. Stop the application



```cmd

docker compose down

```



The named MySQL volume preserves database data when containers are stopped and removed. Do not use `docker compose down -v` if you want to retain that data.



\## Main Modules



\- Dashboard

\- Product Inventory

\- Order Management

\- Shipment Tracking

\- Delivery Management

\- User Management



\## Security Notes



\- Never commit `.env` or database credentials.

\- Use `.env.example` to document the required environment variables without exposing secrets.



\## Troubleshooting



\- Ensure Docker Desktop is running.

\- If a port is already in use, change the host-side port mapping in `docker-compose.yml` and update the corresponding URL.

\- If a service fails to start, inspect its logs:



```cmd

docker compose logs --tail=100

```



\## Academic Project



Cloud Logistics and Supply Chain Management Platform — LogiFlow.