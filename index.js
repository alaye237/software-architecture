
import 'dotenv/config'; 
import express,{json} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {dirname,join} from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './routes/users-route.js';
import authRouter from './routes/auth-routes.js';
import transRouter from './routes/trans-routes.js'

// call dotenv which looks for an env file and pull in any anv variable from that file

dotenv.config();

//declare a __dirname variable to store some static files and specify where the static files are

const __dirname = dirname(fileURLToPath(import.meta.url));
//lets create our express application
const app = express();

// let's get the port in our env file

const PORT = process.env.PORT ||  5000; //in case it is not found in env it will run on port 5000 by default
// to make sure our http and cookies get sent to the browser and also specify our credentals

const corsOption = {Credential:true, origin:process.env.URL || '*'};




app.use(cors(corsOption));
app.use(json());
app.use(cookieParser());
// let's serve our app for a static page 
// found in express documentation. here we are putting static files in a folder called public
app.use('/', express.static(join(__dirname,'public')));
app.use('/v1/api/users', usersRouter)
app.use('/v1/api/auth', authRouter)
app.use('/v1/api/transactions', transRouter)

// now our app can start listening
app.listen(PORT, ()=>console.log(`server is listening on ${PORT} `))