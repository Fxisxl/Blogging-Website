import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify } from 'hono/jwt'

// remember use this code below whenever you have a envrionment variable in Hono (as TS throws type error for env strings)
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
	}
}>();

//middleware
app.use('/api/v1/blog/*', async (c, next) => {
  // get the header
  // verify the header
  // if the header is correct, we need can proceed
  // if not, we return the user a 403 status code
  const header= c.req.header('authorization') ||"";
  // format of the tokem can be Bearer_<token>
  // Bearer token => ["Bearer", "token"]
  const token = header.split(' ')[1];


  //@ts-ignore
  const response = await verify(header, c.env.JWT_SECRET);
  if(response.id){ 
    // if the token is valid, we can proceed
    // call next to proceed
    await next()
  }else{
    c.status(403);
    return c.json({error : "Unauthorized"})
  }

})


app.post('/api/v1/signup', async (c) => {
  
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();

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
})


app.post('/api/v1/signin', async (c) => {
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
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
    })
})

app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

export default app
