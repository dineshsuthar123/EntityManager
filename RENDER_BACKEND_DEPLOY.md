# Deploy the Spring Boot backend to Render

This guide shows two ways to deploy just the backend in `project1/project1` to Render: via Blueprint (uses the existing `render.yaml`) and via a single Docker Web Service.

---

## What you already have
- Dockerfile: `project1/project1/Dockerfile` (uses Java 17 and binds to Render's `$PORT`)
- Backend build: Maven (`mvnw`) builds `target/project1-1.0-SNAPSHOT.jar`
- Config: `src/main/resources/application.properties` uses H2 in-memory DB by default (OK for quick deploy). You can switch to PostgreSQL later via env vars.
- Blueprint: `render.yaml` declares a backend service named `entity-backend` (runtime: docker)

---

## Option A — Deploy via Render Blueprint (recommended)
This deploys from the root of the repo using `render.yaml`.

1) Push your repo to GitHub/GitLab.
2) In Render Dashboard: New ➜ Blueprint ➜ Connect your repo ➜ pick branch (main).
3) Render shows services from `render.yaml`. Select `entity-backend` and click Apply.
4) Review settings (instance type/region). Keep Auto-Deploy on commit.
5) Environment variables:
   The YAML sets `SPRING_PROFILES_ACTIVE=prod`. If you don't add a profile file, the app still runs using defaults. Add these (in Dashboard ➜ your service ➜ Environment):
   - APP_JWTSECRET: a long random string (overrides `app.jwtSecret`)
   - APP_JWTEXPIRATIONMS: 86400000 (optional; overrides `app.jwtExpirationMs`)
   - Optional for PostgreSQL (see section below):
     - SPRING_DATASOURCE_URL
     - SPRING_DATASOURCE_USERNAME
     - SPRING_DATASOURCE_PASSWORD
     - SPRING_JPA_HIBERNATE_DDL_AUTO=update
6) Click Deploy. Wait for build + start to finish. Check Logs tab.

Verify:
- Open the service URL, e.g. `https://entity-backend-xxxx.onrender.com`
- Swagger (if enabled): `/swagger-ui.html`

---

## Option B — Deploy as a single Docker Web Service (without Blueprint)
1) Render Dashboard: New ➜ Web Service
2) Select your repo, set Root Directory to repo root.
3) Choose “Docker” runtime.
4) Dockerfile path: `project1/project1/Dockerfile`
5) Environment variables (same as above):
   - APP_JWTSECRET, APP_JWTEXPIRATIONMS
   - Optional: PostgreSQL variables
6) Create Web Service ➜ first build starts automatically.

---

## Optional: Use Render PostgreSQL
If you want persistence in production:
1) Render Dashboard: New ➜ PostgreSQL. Create DB.
2) In the DB page, copy the external connection string. It looks like `postgres://USER:PASS@HOST:PORT/DB`.
3) Add these env vars to your backend service:
   - SPRING_DATASOURCE_URL=jdbc:postgresql://HOST:PORT/DB?sslmode=require
   - SPRING_DATASOURCE_USERNAME=USER
   - SPRING_DATASOURCE_PASSWORD=PASS
   - SPRING_JPA_HIBERNATE_DDL_AUTO=update
4) Add the PostgreSQL driver to `pom.xml` (if not already):
   ```xml
   <dependency>
     <groupId>org.postgresql</groupId>
     <artifactId>postgresql</artifactId>
     <scope>runtime</scope>
   </dependency>
   ```
5) Redeploy.

Notes:
- Spring Boot maps env vars to properties (e.g., `SPRING_DATASOURCE_URL` ➜ `spring.datasource.url`).
- Hibernate dialect is auto-detected when the driver is present; you can still set `SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect` if desired.

---

## Local test (Windows PowerShell)
Build the JAR and Docker image, then run mapping `$PORT`:

```powershell
# From repo root
cd project1/project1
./mvnw -q -DskipTests package

# Back to repo root (where Docker context matches Dockerfile location if needed)
cd ../..

docker build -t entity-backend -f project1/project1/Dockerfile project1/project1

docker run --rm -p 8080:8080 -e PORT=8080 entity-backend
```

Then open http://localhost:8080 (or http://localhost:8080/swagger-ui.html)

---

## Health checks
- Your `render.yaml` comments out `healthCheckPath`. If you add Spring Actuator:
  ```xml
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  ```
  Then add `healthCheckPath: /actuator/health` in `render.yaml` and redeploy.

---

## Troubleshooting
- Build takes long: enable “Build with cache” and/or increase instance type for builds.
- Port errors: Render sets `$PORT`; the Dockerfile already runs with `-Dserver.port=$PORT`.
- JAR not found: verify the artifact name is `project1-1.0-SNAPSHOT.jar` under `target/`.
- H2 in production: OK for demos; for persistence, switch to Render PostgreSQL.
- File uploads: if you need to keep uploaded files, add a Render Disk (Settings ➜ Disks) and store under that mount path. Ephemeral filesystem is reset on deploy.
- CORS: backend currently allows `*`. For production, restrict to your frontend origin.
- Security: consider disabling H2 console and using strong JWT secrets in prod.

### Windows: "port is already allocated" on 8080
If `docker run -p 8080:8080` fails because 8080 is in use:

1) See which process is using 8080

```powershell
netstat -ano | findstr :8080
# Note the PID in the last column
tasklist /FI "PID eq <PID>"
```

2) Stop the process (only if safe to do so)

```powershell
Stop-Process -Id <PID> -Force
```

3) Or, map to a different host port

```powershell
docker run --rm -p 8081:8080 -e PORT=8080 entity-backend
# Then open http://localhost:8081/healthz
```

---

## After backend is live
Update your frontend API base URL to the Render URL, e.g. `https://<your-backend>.onrender.com/api`. If you deploy the frontend on Render too, set `VITE_API_URL` accordingly in the frontend service env vars.
