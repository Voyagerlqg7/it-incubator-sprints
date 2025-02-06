import express from "express"
import {Request, Response} from "express"
import {SETTINGS} from './settings';
import {videos} from "./videos";
import {Video} from "./videos";

const app = express();
app.use(express.json());

/*Return all videos*/
app.get("/hometask_01/api/videos",(request:Request, response:Response):void => {
    if(videos.length > 0){
        response.status(200).send(videos);
    }
    else{response.status(404);}
})
/*Get by ID*/
app.get(`/hometask_01/api/videos/:id`,(request:Request, response:Response):void => {
    let specificVideo = videos.find(item=> item.id === +request.params.id);
    if(specificVideo){
        response.status(200).send(specificVideo);
    }
    else{
        response.status(404);}
})
app.put("/hometask_01/api/videos",(request:Request, response:Response):void=> {

})
app.post("/hometask_01/api/videos",(request:Request, response:Response):void=> {
    let ReqTitle:string = request.body.title;
    if(!ReqTitle || typeof ReqTitle !== string || ReqTitle.trim()) {
        response.status(400).send({errorsMessage:[{
                "message": "Incorrect title",
                "field": "title"
            }]
        });
    }
    const newVideo = {
            id: +(new Date()),
            title: request.body.title,
            author: request.body.author
    }
    videos.push(newVideo);
    response.status(201).send(newVideo);
})

/*Delete by ID*/
app.delete(`/hometask_02/api/videos/:id`,(request:Request, response:Response):void => {
    for(let i:number=0; i<videos.length; i++){
        if(videos[i].id === +request.params.id){
            videos.splice(i,1);
            response.status(204);
            return;
        }
        response.status(404);
    }
})


app.listen(SETTINGS.PORT, () => {
    console.log('...server started in port ' + SETTINGS.PORT)
})