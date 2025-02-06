import express from "express"
import {Request, Response} from "express"
import {SETTINGS} from './settings';
import {videos} from "./videos";
import bodyParser from 'body-parser'

const app = express();
app.use(bodyParser.json())

const VALID_RESOLUTIONS: string[] = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

/*Return all videos*/
app.get("/videos",(request:Request, response:Response):void => {
    if(videos.length > 0){
        response.status(200).send(videos);
    }
    else{response.status(404);}
})
/*Get by ID*/
app.get(`/videos/:id`,(request:Request, response:Response):void => {
    let specificVideo = videos.find(item=> item.id === +request.params.id);
    if(specificVideo){
        response.status(200).send(specificVideo);
    }
    else{
        response.status(404);}
})
app.put("/videos/:id",(request:Request, response:Response):void=> {
    let ReqTitle: string = request.body.title;
    let ReqAuthor: string = request.body.author;
    let ReqResolution: string = request.body.availableResolutions;
    let ReqMinAgeRestriction: string = request.body.minAgeRestriction;

    if(!ReqTitle || typeof ReqTitle !== 'string' || !ReqTitle.trim()|| ReqTitle.length>40 ||
        !ReqAuthor || typeof ReqAuthor !== 'string' || !ReqAuthor.trim()|| ReqAuthor.length>20
        || ReqResolution.length<0
        || +ReqMinAgeRestriction > 18 || +ReqMinAgeRestriction < 1)
    {

        response.status(400).send({
            errorsMessage:[{
                "message": "Incorrect title",
                "field": "title"
            }],
        });
        return;
    }

    let updateVideoInfo = videos.find(item=> item.id === +request.params.id)
    if(updateVideoInfo){
        updateVideoInfo.title = request.body.title;
        updateVideoInfo.author = request.body.author;
        updateVideoInfo.availableResolutions = request.body.availableResolutions;
        updateVideoInfo.canBeDownloaded = request.body.canBeDownloaded;
        updateVideoInfo.minAgeRestriction = request.body.minAgeRestriction;
        updateVideoInfo.publicationDate = request.body.publicationDate;
        response.status(200).send(updateVideoInfo);
        return;
    }


    response.status(404).send({})
})

app.post("/videos",(request:Request, response:Response):void=> {
    let ReqTitle: string = request.body.title;
    let ReqAuthor: string = request.body.author;
    let ReqResolution: string = request.body.availableResolutions;

    if(!ReqTitle || typeof ReqTitle !== 'string' || !ReqTitle.trim()|| ReqTitle.length>40 ||
        !ReqAuthor || typeof ReqAuthor !== 'string' || !ReqAuthor.trim()|| ReqAuthor.length>20
        || ReqResolution.length<0)
    {
        response.status(400).send({
            errorsMessage:[{
                "message": "Incorrect title",
                "field": "title"
            }],
        });
        return;
    }
    const newVideo = {
        id: videos.length + 1,
        title: request.body.title,
        author: request.body.author,
        canBeDownloaded: request.body.canBeDownloaded ?? false,
        minAgeRestriction: request.body.minAgeRestriction ?? null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        availableResolutions: request.body.availableResolutions
    }
    videos.push(newVideo);
    response.status(201).send(newVideo);
})

/*Delete by ID*/
app.delete(`/videos/:id`,(request:Request, response:Response):void => {
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