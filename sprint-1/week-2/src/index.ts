import express from "express";
import {Request, Response} from "express";
const app = express();
const port = process.env.PORT || 6419;
app.use(express.json());

app.get("/", (request: Request, response: Response) => {

})
app.put("/", (request: Request, response: Response) => {

})
app.post("/", (request: Request, response: Response) => {

})
app.delete("/", (request: Request, response: Response) => {

})


app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})
export default app;