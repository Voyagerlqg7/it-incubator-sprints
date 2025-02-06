import express from "express"
import {Request, Response} from "express"
import {SETTINGS} from './settings';
import {videos} from "./videos";
import bodyParser from 'body-parser'

const app = express();
const parser = bodyParser.json();
app.use(parser)

const validResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
const isValidResolution = (resolutions: string[]) => {
    return resolutions.every(res => validResolutions.includes(res));
}

app.get("/videos", (_, response: Response): void => {
        response.send(videos);
});
app.get(`/videos/:videoid`, (request: Request, response: Response): void => {
    const id = +request.params.videoid;
    const video = videos.find(item => item.id === id);
    if (video) {
        response.status(200).send(video);
    } else {
        response.status(404).send({});
    }
});
app.put("/videos/:videoid", (request: Request, response: Response): void => {
    let title = request.body.title
    if(!title || typeof title !=='string'|| !title.trim()|| title.length>40) {
        response.status(400).send({
            errorsMessages:[{
                "message": "Invalid title",
                "field" : "title"
            }]
        })
        return;
    }
    const id = +request.params.videoid;
    const video = videos.find(item => item.id === id);
    if(video){
        video.title = title;
        response.status(204).send(video)
    }
    else{
        response.send(404)
    }
});
app.post("/videos", (request: Request, response: Response): void => {
    let title = request.body.title
    if(!title || typeof title !=='string'|| !title.trim()|| title.length>40) {
        response.status(400).send({
            errorsMessages:[{
                "message": "Invalid title",
                "field" : "title"
            }]
        })
        return;
    }
    const newVideo = {
        id:+(new Date()),
        title:title,
        author: 'new author'
    }
    videos.push(newVideo)
    response.status(201).send(newVideo);
});
app.delete(`/videos/:id`, (request: Request, response: Response): void => {
        const id = +request.params.id
        const newVideos = videos.filter(item => item.id !== id)
        if (newVideos.length < videos.length) {
            videos.push(...newVideos);
            response.send(204)
        } else {
            response.send(404);
        }
    });
app.delete("/testing/all-data", (request: Request, response: Response): void => {
    if (videos.length > 0) {
        videos.length = 0;
        response.status(204).send();
    } else {response.status(204).send();}
})

app.listen(SETTINGS.PORT, () => {
    console.log('...server started in port ' + SETTINGS.PORT)
})