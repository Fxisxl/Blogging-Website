import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign,verify } from "hono/jwt";
import { signupInput,signinInput } from "validator-common";

export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET: string
	}
}>();;

userRouter.post('/signup', async (c) => {
  
    // we have to initialized the prisma client in every route - drawback of cloudflare serverless/edge workers
    
    const body = await c.req.json();
    const {success} =  signupInput.safeParse(body); // added zod validation
    if (!success){
      c.status(411);
      return c.json({error : "Input are incorrect"});
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    
    // This is where we sanitize the input ie to add zod validation
    // format 
    // {
    //      email: string, 
    //      password: string
    // }

    try{
    const user  = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      }
    });
    //@ts-ignore
    const token  = await sign({id: user.id}, c.env.JWT_SECRET)

    return c.json({
      jwt : token
    })
  }
  catch(e){
    c.status(403);
    return c.json({error : "User already exists"})
  }
})


userRouter.post('/signin', async (c) => {

  const body = await c.req.json();
  const {success} =  signinInput.safeParse(body); // added zod validation
    if (!success){
      c.status(411);
      return c.json({error : "Input are incorrect"});
    }

  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    

    try{
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password
      }
    });

    if(!user){
      c.status(403);
      return c.json({error : "User not found"});
    }

    //@ts-ignore 
    const token  = await sign({id: user.id}, c.env.JWT_SECRET)

    return c.json({
      jwt : token
    })}
    catch(e){
      c.status(403);
      return c.json({error : "User not found or password incorrect"})
    }
})