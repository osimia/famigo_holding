# FAMIGO Holding site

Static HTML site prepared for Railway deployment.

## Local run

```bash
npm start
```

The server uses `PORT` from the environment. Example:

```bash
PORT=3001 npm start
```

## Railway deploy

1. Push this folder to a GitHub repository.
2. In Railway, create a new project from the GitHub repo.
3. Railway will use `npm start` from `package.json`.
4. Generate a public domain in Railway service settings.
# famigo_holding
