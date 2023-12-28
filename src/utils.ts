import { IncomingMessage, ServerResponse } from "node:http";

function errorResponse() {}

function dataResponse<T>(data: T|T[]|undefined,status:number, message: string,res:ServerResponse) {
  const jsonResponse={
    status:status,
    message:message,
    data:data ? data : null
  }
  res.writeHead(status);
  res.write(JSON.stringify(jsonResponse));
  res.end();
}

function readJson<T>(
  method: string,
  req: IncomingMessage,
  validFunction: (json: T) => boolean
): Promise<T> {
  const methodSupport: string[] = ["POST", "PUT", "PATCH"];

  return new Promise((resolve, reject) => {
    if (methodSupport.includes(method)) {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        if (data.length === 0) {
          reject("Dont exist data on Json request");
        } else {
          try {
            const formData: T = JSON.parse(data);

            if (validFunction(formData)) {
              resolve(formData);
            } else {
              reject("Error parsing JSON to specific Type");
            }
          } catch (error) {
            //console.error(error); // Log the parsing error
            reject("Invalid JSON data,verify JSON ");
          }
        }
      });
      req.on("error", (error) => {
        reject(error);
      });
    } else {
      const formData: T= {} as T
      resolve(formData);
      //reject("Send JSON only allowed : " + methodSupport.join(","));
    }
  });
}

export { errorResponse, readJson, dataResponse };
