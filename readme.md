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

- Client side is automatically done with [Vercel](https://vercel.com/) every time someone push on `main`
- Server side is automatically done with [Render](https://render.com/) every time someone push on `main`

# Demo

To launch the demo, you need to "wake up" the server because I'm using Render on free plan so the server is sleeping until you use it.

What you need to do is simply to go to this URL: https://poker-planning-demo-server.onrender.com/

URL of demo: https://poker-planning-demo-client.vercel.app/
