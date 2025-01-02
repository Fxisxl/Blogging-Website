import { Hono } from 'hono'
import { userRouter } from './routes/user';
import {blogRouter} from './routes/blog';
// remember use this code below whenever you have a envrionment variable in Hono (as TS throws type error for env strings)
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET: string
	}
}>();

//middleware
// app.use('/api/v1/blog/*', async (c, next) => {
//   // get the header
//   // verify the header
//   // if the header is correct, we need can proceed
//   // if not, we return the user a 403 status code
//   const header= c.req.header('authorization') ||"";
//   // format of the tokem can be Bearer_<token>
//   // Bearer token => ["Bearer", "token"]
//   const token = header.split(' ')[1];


//   //@ts-ignore
//   const response = await verify(header, c.env.JWT_SECRET);
//   if(response.id){ 
//     // if the token is valid, we can proceed
//     // call next to proceed
//     await next()
//   }else{
//     c.status(403);
//     return c.json({error : "Unauthorized"})
//   }

// })


// Creating better routes
app.route('/api/v1/blog', blogRouter)
app.route('/api/v1/user', userRouter)




export default app
