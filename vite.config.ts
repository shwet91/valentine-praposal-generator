import path from "path";
import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react";

function apiRoutes(): Plugin {
  return {
    name: "api-routes",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();

        const routePath = req.url.split("?")[0]; // e.g. /api/registerUser
        const appRoutePath = `/app${routePath}`; // e.g. /app/api/registerUser
        const filePath = path.resolve(__dirname, `.${appRoutePath}/route.ts`);

        try {
          // Use Vite's ssrLoadModule so TS + path aliases work
          const mod = await server.ssrLoadModule(`${appRoutePath}/route.ts`);
          const handler = mod[req.method || "GET"];

          if (typeof handler !== "function") {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
          }

          // Collect body
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const bodyText = Buffer.concat(chunks).toString();

          // Build a Web-standard Request
          const protocol = req.headers["x-forwarded-proto"] || "http";
          const host = req.headers.host || "localhost";
          const url = `${protocol}://${host}${req.url}`;
          const webReq = new Request(url, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: ["GET", "HEAD"].includes(req.method || "")
              ? undefined
              : bodyText,
          });

          const webRes: Response = await handler(webReq);

          res.statusCode = webRes.status;
          webRes.headers.forEach((val, key) => res.setHeader(key, val));
          const text = await webRes.text();
          res.end(text);
        } catch (e: any) {
          console.error("API route error:", e);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [react(), apiRoutes()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
