import fetch from 'node-fetch';
import { expect } from '@wdio/globals';

describe('Confluence API token smoke test', () => {
  it('should authenticate using CONFLUENCE_API_TOKEN', async () => {
    // build a Basic auth header from your ENV vars
    const auth = Buffer
       .from(`${process.env.CONFLUENCE_USER_EMAIL}:${process.env.CONFLUENCE_API_TOKEN}`)
       .toString('base64');

    // call the “current user” endpoint
    const response = await browser.call(() =>
      fetch(`${process.env.CONFLUENCE_BASE_URL}/wiki/rest/api/user/current`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
        }
      })
    );

    // verify we got a 200 and a valid JSON payload
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('accountId');
  });
});