/**
 * Vercel entry: `config` must live here so raw body verification works.
 * Handler implementation: `../server/api/webhooks`.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

export { default } from '../server/api/webhooks.js';
