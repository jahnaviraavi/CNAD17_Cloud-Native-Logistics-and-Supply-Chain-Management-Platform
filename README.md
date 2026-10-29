# 🚚 LogiFlow — Cloud Logistics & Supply Chain Management Platform

**A Full-Stack, Dockerized Logistics Management Application**

LogiFlow is a full-stack web application designed to streamline logistics and supply chain operations through a centralized platform. It provides modules for product inventory, order management, shipment tracking, delivery management, and user management.

Built using **React, Spring Boot, MySQL, and Docker**, LogiFlow demonstrates the integration of modern web technologies with containerized application deployment.

## ✨ Features

- 📊 **Dashboard** — Centralized interface for accessing logistics modules.
- 📦 **Product Inventory** — Manage product details, prices, and stock quantities.
- 🛒 **Order Management** — Organize and manage order information.
- 🚚 **Shipment Tracking** — Manage shipment records and tracking information.
- 🏁 **Delivery Management** — Maintain delivery records and operational details.
- 👥 **User Management** — Manage user information.
- 🔗 **RESTful APIs** — Backend services powered by Spring Boot.
- 🐳 **Dockerized Deployment** — Run application services using Docker Compose.
- 🗄️ **Persistent Database** — Store application data using MySQL with a named Docker volume.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite |
| Web Server | Nginx |
| Backend | Java 21, Spring Boot |
| Database | MySQL 8.0 |
| API Communication | REST, JSON |
| Containerization | Docker |
| Orchestration | Docker Compose |

## 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │    User / Browser   │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   React Frontend    │
                 │    Nginx Server     │
                 │    Port: 5174       │
                 └──────────┬──────────┘
                            │
                       REST APIs
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Spring Boot API   │
                 │    Java 21          │
                 │    Port: 8082       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      MySQL 8.0      │
                 │   Persistent Data   │
                 └─────────────────────┘

                    Docker Compose
```

## 📁 Project Structure

```text
logiflow-release/
├── backend/                  # Spring Boot REST API
├── frontend/                 # React frontend application
├── docker-compose.yml        # Multi-container configuration
├── .env.example              # Environment variable template
├── .gitignore                # Git exclusion rules
└── README.md                 # Project documentation
```

## ⚙️ Prerequisites

Before running the application, ensure that you have:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Git installed if you want to clone the repository.

**Note:** Java, Node.js, and MySQL do not need to be installed separately when running the application through Docker Compose.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd logiflow-release
```

If the project is already on your computer, open a terminal in the project root directory.

### 2. Configure Environment Variables

Create a `.env` file from the example template.

**Windows CMD:**

```cmd
copy .env.example .env
```

**PowerShell:**

```powershell
Copy-Item .env.example .env
```

Open `.env` and replace the placeholder values with your local configuration, including a strong database password.

Ensure that the environment variable names match those referenced in `docker-compose.yml`.

### 3. Build and Run the Application

Execute the following command from the project root:

```bash
docker compose up -d --build
```

Docker Compose builds the required images and starts the configured application services in the background.

### 4. Verify the Services

```bash
docker compose ps
```

Check the logs if any service takes time to start:

```bash
docker compose logs --tail=100
```

### 5. Access the Application

Once all services are running, open the following URLs:

| Service | URL |
|---|---|
| LogiFlow Frontend | [http://localhost:5174](http://localhost:5174) |
| Products REST API | [http://localhost:8082/api/products](http://localhost:8082/api/products) |

The products endpoint returns a JSON response based on the backend implementation and the available database records.

## 🔌 REST API

LogiFlow uses Spring Boot to expose backend functionality through RESTful endpoints.

### Products API

| Property | Description |
|---|---|
| Endpoint | `/api/products` |
| HTTP Method | `GET` |
| Response Format | JSON |
| Local URL | `http://localhost:8082/api/products` |

Example response:

```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 55000.0,
    "quantity": 10
  }
]
```

*The example illustrates the expected response structure; actual data depends on the application and database.*

## 🐳 Docker Commands

| Operation | Command |
|---|---|
| Start services | `docker compose up -d` |
| Rebuild and start | `docker compose up -d --build` |
| Check service status | `docker compose ps` |
| View logs | `docker compose logs --tail=100` |
| Follow logs | `docker compose logs -f` |
| Stop services | `docker compose down` |

### Database Persistence

The named MySQL volume preserves database data when containers are stopped and removed.

Avoid the following command unless you intentionally want to remove the associated volumes and potentially delete persisted database data:

```bash
docker compose down -v
```

## 🔐 Security Best Practices

- Never commit `.env` files or database credentials to GitHub.
- Use `.env.example` to document required variables without exposing secrets.
- Use strong database passwords.
- Avoid exposing the database port publicly unless required.
- Validate API requests and handle errors appropriately.
- Configure authentication, authorization, and HTTPS before production deployment.

## 🛠️ Troubleshooting

**Docker is not running**

Start Docker Desktop and verify that its engine is ready.

**Port already in use**

Change the host-side port mapping in `docker-compose.yml` and use the updated URL.

**Backend cannot connect to MySQL**

Verify database credentials, Docker network configuration, and database readiness.

**Frontend cannot access the backend**

Confirm that the backend is running and that the frontend API base URL points to the correct host and port.

**Inspect service logs**

```bash
docker compose ps
docker compose logs --tail=100
```

## 🔮 Future Enhancements

Potential improvements include:

- Role-based access control.
- Advanced inventory and order analytics.
- Automated shipment and delivery status updates.
- Low-stock notifications.
- Search, filtering, and pagination.
- Cloud deployment, monitoring, and production-grade security.

These are potential future enhancements and may not be implemented in the current version.

## 🎓 Academic Project

**Project:** LogiFlow — Cloud Logistics and Supply Chain Management Platform

**Domain:** Full-Stack Development | Cloud Computing | Supply Chain Management

**Objective:** To demonstrate the integration of a modern frontend, backend REST APIs, relational database management, and containerized deployment in a unified logistics application.

---

<div align="center">

**LogiFlow**

*Connecting inventory, orders, shipments, and deliveries through one unified platform.* 🚀

</div>
