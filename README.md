# Mobile App

## Prerequisites
- Node.js installed
- Expo CLI (optional, can use npx)
- Expo Go app installed on your phone (if using physical device)

---

## Install dependencies

From the project root:

```bash
cd mobile
npm install
```

## Start the development server
```bash
npx expo start
```

## Run the app

After starting Expo:
- Press `a` → run on Android emulator
- Press `i` → run on iOS simulator (Mac only)
- Scan QR code → run on physical device using Expo Go

## Troubleshooting

Reset cache if issues occur:
```bash
npx expo start -c
```

Reinstall dependencies if needed:
```bash
rm -rf node_modules
npm install
```

---

# Listory Server

This directory contains all backend infrastructure for Listory.

## Services

- PostgreSQL (main database)
- ElectricSQL (planned sync layer)

## Running locally

```bash
docker compose up -d
```

## Reset database
```bash
docker compose down -v
docker compose up -d
```
