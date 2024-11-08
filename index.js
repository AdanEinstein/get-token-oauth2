import { AuthorizationCode } from "simple-oauth2";
import { createServer } from "node:http";

// Environment variables
const TENANT_ID = process.env.TENANT_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SCOPE = process.env.SCOPE;
const REDIRECT_URI = process.env.REDIRECT_URI;
const PORT = process.env.PORT;

const client = new AuthorizationCode({
  client: {
    id: CLIENT_ID,
    secret: CLIENT_SECRET,
  },
  auth: {
    tokenHost: "https://login.microsoftonline.com",
    tokenPath: `/${TENANT_ID}/oauth2/v2.0/token`,
    authorizeHost: "https://login.microsoftonline.com",
    authorizePath: `/${TENANT_ID}/oauth2/v2.0/authorize`,
  },
});

const app = createServer(async (req, res) => {
  if (req.url.startsWith(new URL(REDIRECT_URI).pathname)){
    try {
      const url = new URL(req.headers.host+req.url);
      const code = url.searchParams.get('code');
      const accessToken = await client.getToken({
        scope: SCOPE,
        redirect_uri: REDIRECT_URI,
        code
      });
      res.writeHead(200, {
        "content-type": "application/json",
        "cache-control": "no-store"
      })
      res.end(JSON.stringify(accessToken.token))
      return
    } catch (error) {
      console.error("ERROR: ", error)
    }
  }
  
  const authorizationUri = client.authorizeURL({
    scope: SCOPE,
    redirect_uri: REDIRECT_URI,
  })

  res.writeHead(302, { 
    location: authorizationUri,
    "cache-control": "no-store" 
  });

  res.end();
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))