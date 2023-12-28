import http, { IncomingMessage, ServerResponse } from "node:http";
import { userController } from "./users";
type keyRoutes = {
  [key: string]: RegExp;
};

const matchRoutes: keyRoutes = {
  "users":/\/users(\/[0-9]*$)?$/,//Que empieze por users y tenga un numero 
};

const requestListener: http.RequestListener = (req: IncomingMessage,res: ServerResponse): void => {
  if (!req.url) return;

  let foundRoute = false;
  const url: string = req.url;
  for (const route in matchRoutes) {
    if (matchRoutes[route].test(url)) {
      const restUrl=url.split(route)[1]
      switch (route) {
        case "users":
          userController(req, res,restUrl);
          break;
      }
      foundRoute = true;
      break;
    }
  }
  if (!foundRoute) {
    res.end("Route not found or error");
  }
};

const server = http.createServer(requestListener);
server.listen(5500);
