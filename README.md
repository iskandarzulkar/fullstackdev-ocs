# OCS - Sistem Approval Dinamis

Repository ini berisi aplikasi approval end-to-end untuk mengelola modul, pegawai, workflow approval, transaksi, dan hasil Need Approval.

## Struktur Project

| Folder | Fungsi |
| --- | --- |
| `ocs-service` | Backend Node.js/Express, migration, seeder, dan stored procedure SQL Server. |
| `ocs-client` | Frontend React/Vite untuk aplikasi approval. |
| `ocs-nginx-reverse-proxy-manager` | Konfigurasi nginx reverse proxy untuk client dan API. |
| `appbuilder` | Dockerfile, konfigurasi build image, dan env build. |
| `multi-env-deployment` | Docker Compose deployment untuk development, staging, dan production. |
| `postman` | Collection dan environment Postman untuk pengujian API. |

## Dokumentasi Backend

Dokumentasi khusus backend ada di:

[ocs-service/README.md](./ocs-service/README.md)

URL backend lokal:

```text
http://localhost:3131/api/v1
```

Saat berjalan melalui nginx reverse proxy, API diakses dari:

```text
http://localhost:8080/api/v1
```

## URL Aplikasi

Environment development default:

```text
http://localhost:8080
```

Port ini dikonfigurasi di:

```text
multi-env-deployment/development/deploy.env
```

## Build Docker Image

Build semua image development:

```bash
./run_build_all.sh
```

Atau jalankan langsung:

```bash
docker compose --env-file appbuilder/dev-build.env -f appbuilder/docker-compose.build.yml build
```

Image yang dibuat:

| Image | Default Tag |
| --- | --- |
| `ocs-service` | `ocs-service:dev-latest` |
| `ocs-client` | `ocs-client:dev-latest` |
| `ocs-nginx-reverse-proxy-manager` | `ocs-nginx-reverse-proxy-manager:dev-latest` |

## Deploy Development

Jalankan:

```bash
./run_deploy_dev.sh
```

Atau:

```bash
docker compose --env-file multi-env-deployment/development/deploy.env -f multi-env-deployment/development/docker-compose.yml up -d
```

## Deploy Staging dan Production

Staging:

```bash
docker compose --env-file multi-env-deployment/staging/deploy.env -f multi-env-deployment/staging/docker-compose.yml up -d
```

Production:

```bash
docker compose --env-file multi-env-deployment/production/deploy.env -f multi-env-deployment/production/docker-compose.yml up -d
```

Pastikan nilai database di `deploy.env` sudah disesuaikan sebelum deployment.

## Konfigurasi Database

Service backend membaca konfigurasi berikut dari environment:

| Variable | Keterangan |
| --- | --- |
| `APP_PORT` | Port backend di dalam container, default `3131`. |
| `DB_USER` | User SQL Server. |
| `DB_PASS` | Password SQL Server. |
| `DB_SERVER` | Host SQL Server. Untuk SQL Server di host Windows, gunakan `host.docker.internal`. |
| `DB_NAME` | Nama database. |
| `DB_ENCRYPT` | Pengaturan enkripsi koneksi SQL Server. |
| `DB_TRUST_SERVER_CERTIFICATE` | Trust certificate SQL Server. |
| `DB_INSTANCE` | Nama instance SQL Server, contoh `SQLEXPRESS`. |

## Migration dan Seeder

Jika menjalankan backend secara lokal tanpa Docker:

```bash
cd ocs-service
npm install
npm run migrate
npm run seeder
npm start
```

Rollback seeder:

```bash
cd ocs-service
npm run seeder:rollback -- --step=100
```

## Route Reverse Proxy

Nginx reverse proxy mengarahkan request sebagai berikut:

| Path | Tujuan |
| --- | --- |
| `/` | `ocs-client:80` |
| `/api/v1/` | `ocs-service:3131/api/v1/` |
| `/health` | Health check nginx |

## Validasi Konfigurasi

Validasi compose build:

```bash
docker compose --env-file appbuilder/dev-build.env -f appbuilder/docker-compose.build.yml config
```

Validasi compose development:

```bash
docker compose --env-file multi-env-deployment/development/deploy.env -f multi-env-deployment/development/docker-compose.yml config
```
