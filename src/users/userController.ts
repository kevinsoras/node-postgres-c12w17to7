import http, { IncomingMessage, ServerResponse } from "node:http";
import { QueryArrayResult, QueryResult } from 'pg';

import { readJson,dataResponse } from "../utils";
import { User, isValidUser } from "./user";
import { database } from "../db";
async function userController(
  req: IncomingMessage,
  res: ServerResponse,
  url: string
) {
  if (!req.method) return;
  const method: string = req.method;
  let dataUser: User;

  try {
    dataUser = await readJson<User>(method, req, isValidUser);
  } catch (error) {
    res.writeHead(500);
    res.write(error);
    res.end();
    return;
  }

  switch (method) {
    case "POST":
      await create(dataUser,res)
      break;
    case "PUT":
    case "PATCH":
      await update(dataUser,res)
      break;
    case "GET":
      if (url === "" || url === "/") {
        //Without id:
        await readAll(res)
      } else {
        //id:
        const id:number=Number(url.split("/")[1] )
        await findById(id,res)
      }
      break;
    case "DELETE":
      const id:number=Number(url.split("/")[1] )
      remove(id,res)
      break;
  }
  return;
}

async function create(data:User,res:ServerResponse) {
  try {
    const query=`INSERT INTO users (name,email,role,rate)
     VALUES ($1, $2, $3, $4) RETURNING *`
     const values = [data.name, data.email,data.role,data.rate];    
    const result: QueryResult = await database.query(query, values);
    if (result.rows.length > 0) {
      dataResponse(result.rows[0],200,"Create User",res)
    } else {
      dataResponse(null,500,"Could not create user",res)
    }
  } catch (error:any) {
    dataResponse(error.message,500,"Could not create user",res)
  } 
}

async function readAll(res:ServerResponse) {
  const query="SELECT id,name,email,role,rate FROM users"
  const result:QueryResult<User>=await database.query(query)
  const listUser:User[]=result.rows
  dataResponse(listUser,200,"Get Users",res)
}
async function findById(id:number,res:ServerResponse){
  const query=`SELECT id,name,email,role,rate FROM users where id =${id}`
  const result:QueryResult<User>=await database.query(query)
  const listUser:User[]=result.rows
  dataResponse(listUser[0],200,"Find User",res)
}
async function update(data:User,res:ServerResponse) {
  try {
    const query=`UPDATE users SET 
    name = $1,email=$2,role=$3,rate=$4 WHERE id = $5 RETURNING *`
     const values = [data.name, data.email,data.role,data.rate,data.id];    
    const result: QueryResult = await database.query(query, values);
    if (result.rows.length > 0) {
      dataResponse(result.rows[0],200,"Update User",res)
    } else {
      dataResponse(null,500,"Could not Update user",res)
    }
  } catch (error:any) {
    dataResponse(error.message,500,"Could not Update user",res)
  } 
}
async function remove(id:number,res:ServerResponse) {
  //delete
  try {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const values = [id];  
    const result: QueryResult = await database.query(query, values);
    if (result.rows.length > 0) {
      dataResponse(result.rows[0],200,"Delete User",res)
    } else {
      dataResponse(null,500,"Could not Delete user",res)
    }
  } catch (error:any) {
    dataResponse(error.message,500,"Could not Delete user",res)
  } 
}

export { userController };
