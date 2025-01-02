import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from "@prisma/extension-accelerate";
import { auth } from 'hono/utils/basic-auth';
import { verify } from 'hono/jwt';
import { createBlogInput,updateBlogInput } from 'validator-common';


export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>();

// middleware - authentication checks for request on any blog route
blogRouter.use ("/*",async(c, next) => {
    //extracts the user id from the token
    //pass it down to the route handler

    const authHeader = c.req.header('authorization')|| "";  // added || "" empty string to prevent type error 
    
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);

        if(user){
            //set the user id in the context
            c.set("userId", user.id as string);
            await next();
        }else{
            c.status(403);  //forbidden
            return c.json({
                message: "You are not logged in or your token is invalid"
            })  
        }
         
    }
    catch(e){
        c.status(403);  //forbidden
        return c.json({
            message: "You are not logged in or your token is invalid"
        })
    }

    
});


blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const {success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const authorId = c.get("userId");

    const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
    
    

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(authorId)
        }
    });



    return c.json({
        id: blog.id, 
    })
})
  
blogRouter.put('/', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
  
    const body = await c.req.json();
    const {success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
          title: body.title,
          content: body.content
      }
  });



    return c.text('Hello Hono!')
})


// Todo : Add pagination to the blog route that returns only 10-15 blogs at a time
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())

      const blogs = await prisma.post.findMany();


      // returns all the blogs
      return c.json({
        blogs
      })
})


  
blogRouter.get('/:id', async(c) => {
    const id =  c.req.param("id"); //getting dyanmic parameter from the url
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
  
    
    
    try{
        const blog = await prisma.post.findFirst({
            where: {
                id: Number(id)
            }
          }
        );
    
    
    
        return c.json({
            blog
        })
    }
    catch(e){
        c.status(404);
        return c.json({error : "Blog not found"})
    }

})

