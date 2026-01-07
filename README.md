# [EasyCourse](https://easycourse.hajder.app)
A platform for creating and enrolling in courses, built with ASP.NET Core and React.

<img width="2560" height="1277" alt="image" src="https://github.com/user-attachments/assets/7f8bcff4-73e5-43b9-80c7-49119c2822cd" />

> A blog post about the architecture and decisions can be found [here](https://hajder.app/projects/easycourse)

## Getting Started

### Prerequisites
- Docker
- Docker Compose
- Node.js 20+
- MySQL 8.0+
- MinIO 

### Run Locally

#### Backend
```bash
git clone https://github.com/hajduty/easycourse.git
cd easycourse/backend
docker compose up --build -d
```
> The backend expects an existing MySQL and MinIO instance and connects to them via the config in .API/appsettings.json

#### Frontend
```bash
git clone https://github.com/hajduty/easycourse.git
cd easycourse/frontend
npm install
npm run dev
```
