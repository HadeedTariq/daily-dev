#### **Prerequisites**

Make sure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (if using `docker-compose`)

---

## **🚀 Running the Project Using Docker**

### **1️⃣ Build Docker Images**

If you haven’t built the images yet, run:

```sh
docker build -t daily-dev-backend ./server
docker build -t daily-dev-frontend ./client
```

---

### **2️⃣ Running Containers Individually**

Run backend and frontend separately using:

```sh
# Start backend
docker run -p 3000:3000 --env-file .env daily-dev-backend

# Start frontend
docker run -p 5173:5173 daily-dev-frontend
```

---

### **3️⃣ Running with Docker Compose**

If you want to run in one command after building images, simply run:

```sh
docker-compose up -d
```

This will start both **frontend** and **backend** containers in **detached mode** (`-d`).

---

### **4️⃣ Stopping and Removing Containers**

To stop the running containers:

```sh
docker-compose down
```

To stop and **remove** all containers, networks, and volumes:

```sh
docker-compose down --volumes --remove-orphans
```

---

### **5️⃣ Checking Logs**

To check logs for a specific service:

```sh
docker-compose logs server
docker-compose logs frontend
```

For real-time logs:

```sh
docker-compose logs -f
```

---

### **6️⃣ Running a Container in Interactive Mode**

To enter the backend container’s shell:

```sh
docker exec -it <backend_container_id> sh
```

To enter the frontend container’s shell:

```sh
docker exec -it <frontend_container_id> sh
```

---

### **📌 Notes**

- Ensure your **`.env` file is correctly configured** before running.
- Use **`docker ps`** to list running containers.
- If you change Docker settings, rebuild images using:

  ```sh
  docker-compose up --build
  ```
