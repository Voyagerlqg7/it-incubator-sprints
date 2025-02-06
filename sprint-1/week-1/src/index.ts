import express from "express"
import {Request, Response} from "express"
import {SETTINGS} from './settings';
import {videos} from "./videos";
import {Video} from "./videos";

const app = express();

/*Return all videos*/
app.get("/hometask_01/api/videos",(request:Request, response:Response):void => {
    if(videos.length > 0){
        response.send(videos).statusCode= 200;
    }
    else{response.statusCode = 404;}
})

app.put("/hometask_01/api/videos",(request:Request, response:Response):void=> {

})

/*Get by ID*/
app.get(`/hometask_02/api/videos/:id`,(request:Request, response:Response):void => {
    let specificVideo = videos.find(item=> item.id === +request.params.id);
    if(specificVideo){
        response.send(specificVideo).statusCode = 200;
    }
    else{
        response.statusCode = 404;
    }

})

app.listen(SETTINGS.PORT, () => {
    console.log('...server started in port ' + SETTINGS.PORT)
})