# Docker Setup Guide

## 📦 การใช้งาน Docker

### วิธีที่ 1: ใช้ Docker Compose (แนะนำ)

#### Production Mode
```bash
# Build และ run container
docker-compose up -d

# ดู logs
docker-compose logs -f

# หยุด container
docker-compose down
```

เข้าใช้งานที่: http://localhost:8080

#### Development Mode
แก้ไข `docker-compose.yml` โดย comment service `web` และ uncomment service `web-dev` แล้วรัน:
```bash
docker-compose up -d web-dev
```

เข้าใช้งานที่: http://localhost:5173

### วิธีที่ 2: ใช้ Docker โดยตรง

#### Build image
```bash
docker build -t larp-basic-web .
```

#### Run container
```bash
docker run -d -p 8080:80 --name larp-web larp-basic-web
```

#### จัดการ container
```bash
# ดู logs
docker logs -f larp-web

# หยุด container
docker stop larp-web

# ลบ container
docker rm larp-web

# ลบ image
docker rmi larp-basic-web
```

