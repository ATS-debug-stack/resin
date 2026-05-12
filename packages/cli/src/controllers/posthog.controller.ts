import { GlobalConfig } from '@resin/config';
import { AuthenticatedRequest } from '@resin/db';
import { RestController } from '@resin/decorators';
import { Container } from '@resin/di';
import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

@RestController('/ph')
export class PostHogController {
	static routers = [
		{
			path: '/',
			router: (() => {
				const router = Router();
				const globalConfig = Container.get(GlobalConfig);
				const targetUrl = globalConfig.diagnostics.posthogConfig.apiHost;

				const proxy = createProxyMiddleware({
					target: targetUrl,
					changeOrigin: true,
					on: {
						proxyReq: (proxyReq, req) => {
							proxyReq.removeHeader('cookie');

							// For POST requests, forward the raw body directly
							const expressReq = req as AuthenticatedRequest & { rawBody?: Buffer };
							if (req.method === 'POST' && expressReq.rawBody) {
								proxyReq.setHeader('Content-Length', expressReq.rawBody.length.toString());
								proxyReq.write(expressReq.rawBody);
							}
						},
					},
				});

				// Use proxy middleware directly - handles all methods and paths
				router.use(proxy);

				return router;
			})(),
			skipAuth: true,
		},
	];
}
