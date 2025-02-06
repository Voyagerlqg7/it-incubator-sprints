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
        response.status(200).send(videos);
});
app.get(`/videos/:id`, (request: Request, response: Response): void => {
    const videoId:number = +request.params.id;

    if (isNaN(videoId)) {
        response.status(400).send({});
        return;
    }

    let specificVideo = videos.find(item => item.id === videoId);

    if (specificVideo) {
        response.status(200).send(specificVideo);
    } else {
        response.status(404).send({});
    }
});
app.put("/videos/:id", (request: Request, response: Response): void => {
    let ReqTitle: string = request.body.title;
    let ReqAuthor: string = request.body.author;
    let ReqResolution: string[] = request.body.availableResolutions;
    let ReqMinAgeRestriction: number | null = request.body.minAgeRestriction;

    if (
        typeof ReqTitle !== 'string' || !ReqTitle.trim() || ReqTitle.length > 40 ||
        typeof ReqAuthor !== 'string' || !ReqAuthor.trim() || ReqAuthor.length > 20 ||
        !Array.isArray(ReqResolution) || ReqResolution.length === 0 ||
        !isValidResolution(ReqResolution) ||  // Валидация доступных разрешений
        (ReqMinAgeRestriction !== null && (typeof ReqMinAgeRestriction !== 'number' || ReqMinAgeRestriction < 1 || ReqMinAgeRestriction > 18))
    ) {
        response.status(400).send({
            errorsMessage: [{
                "message": "Incorrect title/author/availableResolutions/minAgeRestriction",
                "field": "title/author/availableResolutions/minAgeRestriction"
            }],
        });
        return;
    }

    let updateVideoInfo = videos.find(item => item.id === +request.params.id)
    if (updateVideoInfo) {
        updateVideoInfo.title = ReqTitle;
        updateVideoInfo.author = ReqAuthor;
        updateVideoInfo.availableResolutions = ReqResolution;
        updateVideoInfo.canBeDownloaded = request.body.canBeDownloaded;
        updateVideoInfo.minAgeRestriction = ReqMinAgeRestriction;
        updateVideoInfo.publicationDate = request.body.publicationDate;
        response.status(200).send(updateVideoInfo);
        return;
    }
    response.status(404).send({});
});

app.post("/videos", (request: Request, response: Response): void => {
    let ReqTitle: string = request.body.title;
    let ReqAuthor: string = request.body.author;
    let ReqResolution: string[] = request.body.availableResolutions;

    if (
        typeof ReqTitle !== 'string' || !ReqTitle.trim() || ReqTitle.length > 40 ||
        typeof ReqAuthor !== 'string' || !ReqAuthor.trim() || ReqAuthor.length > 20 ||
        !Array.isArray(ReqResolution) || ReqResolution.length === 0 ||
        !isValidResolution(ReqResolution)  // Валидация доступных разрешений
    ) {
        response.status(400).send({
            errorsMessage: [{
                "message": "Incorrect title/author/availableResolutions",
                "field": "title/author/availableResolutions"
            }],
        });
        return;
    }

    const newVideo = {
        id: +(new Date()),
        title: ReqTitle,
        author: ReqAuthor,
        canBeDownloaded: request.body.canBeDownloaded ?? false,
        minAgeRestriction: request.body.minAgeRestriction ?? null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        availableResolutions: ReqResolution
    };

    videos.push(newVideo);
    response.status(201).send(newVideo);
});

app.delete(`/videos/:id`, (request: Request, response: Response): void => {
    for (let i: number = 0; i < videos.length; i++) {
        if (videos[i].id === +request.params.id) {
            videos.splice(i, 1);
            response.status(204).send();
            return;
        }
    }
    response.status(404).send({});
});
app.delete("/testing/all-data", (request: Request, response: Response): void => {
    if (videos.length > 0) {
        videos.length = 0;
        response.status(204).send();
    } else {response.status(204).send();}
});

app.listen(SETTINGS.PORT, () => {
    console.log('...server started in port ' + SETTINGS.PORT)
})