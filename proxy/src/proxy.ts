import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { Request, Response } from "express";

const setRequestBodyData = (proxyReq: any, req: Request) => {
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader("Content-Type", "application/json");
    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
};

const responseHandle = (proxyRes: any) => {
  proxyRes.headers["access-control-allow-origin"] = "*";
};

const proxyError = (err: Error, _req: Request, res: Response) => {
  console.error("Proxy Error:", err);
  res.status(500).send("Proxy Error");
};

const createProxy = (target: string, pathPrefix: string) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^/${pathPrefix}`]: "",
    },
    on: {
      proxyReq: (proxyReq, req, res) => setRequestBodyData(proxyReq, req as Request),
      proxyRes: (proxyRes, req, res) => responseHandle(proxyRes),
      error: (err, req, res) => proxyError(err, req as Request, res as Response),
    },
  } as Options);

export const authProxy = createProxy(
  "http://localhost:4001/api/v1/login-signup",
  "login-signup"
);

export const basicProxy = createProxy(
  "http://localhost:4002/api/v1/basic",
  "basic"
);

export const submissionProxy = createProxy(
  "http://localhost:4003/api/v1/submission",
  "submission"
);

export const adminProxy = createProxy(
  "http://localhost:4004/api/v1/admin",
  "admin"
);
