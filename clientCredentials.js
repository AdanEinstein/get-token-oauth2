import { ClientCredentials } from "simple-oauth2";

// Environment variables
const TENANT_ID = process.env.TENANT_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SCOPE = process.env.SCOPE;

const client = new ClientCredentials({
  client: {
    id: CLIENT_ID,
    secret: CLIENT_SECRET,
  },
  auth: {
    tokenHost: "https://login.microsoftonline.com",
    tokenPath: `/${TENANT_ID}/oauth2/v2.0/token`,
  },
});

const accessToken = await client.getToken({
  scope: SCOPE,
});

console.log(accessToken.token);