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
  },
});

const app = createServer(async (req, res) => {
  if (req.url.startsWith("/auth/redirect")){
    try {
      const code = new URLSearchParams(req.url.split('?')[1]).get('code');
      const accessToken = await client.getToken({
        scope: SCOPE,
        redirect_uri: REDIRECT_URI,
        code
      });
      res.writeHead(200, {
        "content-type": "application/json"
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

  res.writeHead(302, { location: authorizationUri });
  res.end();
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))