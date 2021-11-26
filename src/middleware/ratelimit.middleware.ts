import * as rateLimit from 'express-rate-limit'

/**
 * Rate limiting middleware to limit requests to an endpoint or app
 * @param limit The maximum number of requests in 24hrs
 * @returns Rate limiting middleware which can be injected into an app or endpoint
 */
export const limitRequests = (limit) =>
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: limit
	})
