## Prerequisites

Make sure you have the following installed:

- Docker
- Docker Compose

Verify installation:

```bash
docker --version
docker compose version
```

---

# Clone the Repository

```bash
git clone <repository-url>
cd daily-dev
```

---

# Environment Variables

Create the required environment files.

### Server

```bash
cp server/.env.example server/.env
```

Update the values if needed.

### Client

```bash
cp client/.env.example client/.env
```

---

# Start the Application

Build and start all services:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d --build
```

Docker Compose will automatically start:

- PostgreSQL
- Redis
- Backend Server
- Frontend Client

---

# Access the Application

| Service     | URL                                            |
| ----------- | ---------------------------------------------- |
| Frontend    | [http://localhost:5173](http://localhost:5173) |
| Backend API | [http://localhost:3000](http://localhost:3000) |
| PostgreSQL  | localhost:5432                                 |
| Redis       | localhost:6379                                 |

---

# View Logs

All services:

```bash
docker compose logs -f
```

Backend only:

```bash
docker compose logs -f server
```

Frontend only:

```bash
docker compose logs -f client
```

PostgreSQL:

```bash
docker compose logs -f postgres
```

Redis:

```bash
docker compose logs -f redis
```

---

# Stop the Application

```bash
docker compose down
```

---

# Remove Containers and Volumes

This removes all containers and database data.

```bash
docker compose down -v
```

---

# Rebuild After Dependency Changes

If package.json changes:

```bash
docker compose up --build
```

Or:

```bash
docker compose build
docker compose up
```

---

# Access a Container Shell

Backend:

```bash
docker exec -it daily_dev_server sh
```

Frontend:

```bash
docker exec -it daily_dev_client sh
```

PostgreSQL:

```bash
docker exec -it daily_dev_postgres psql -U myuser -d daily-dev-db
```

Redis:

```bash
docker exec -it daily_dev_redis redis-cli
```

---

# Common Commands

### Check running containers

```bash
docker ps
```

### Restart all services

```bash
docker compose restart
```

### Recreate containers

```bash
docker compose down
docker compose up --build
```
