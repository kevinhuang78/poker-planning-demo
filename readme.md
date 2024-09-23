# Launch project locally

- Go in `server` folder
- Copy `.env.sample` to `.env`
- Generate a SSL certificate: `openssl req -nodes -new -x509 -keyout localhost.key -out localhost.cert -days 365`
- Run `yarn start`

With another terminal:
- Go in `client` folder
- Copy `.env.sample` to `.env`
- Run `yarn dev`

# Deployment process

- Client side is automatically done with Vercel every time someone push on `main`
- Server side is automatically done with [Render](https://dashboard.render.com/) every time someone push on `main`

# Demo
URL of demo: https://poker-planning-demo-client.vercel.app/
