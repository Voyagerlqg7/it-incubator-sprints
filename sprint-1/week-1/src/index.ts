const express = require("express");
const dotenv = require("dotenv");
import { Request,Response } from "express";
import {Video} from "./VideosDB";
import {videos} from "./VideosDB"

dotenv.config();
const app = express();
const port = process.env.PORT || 6419;

app.use(express.json());

const validateVideo = (video: Partial<Video>): { isValid: boolean; errors: { message: string; field: string }[] } => {
    const errors: { message: string; field: string }[] = [];
    const validResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

    if (!video.title || typeof video.title !== "string" || video.title.length > 40) {
        errors.push({ message: "Invalid title", field: "title" });
    }

    if (!video.author || typeof video.author !== "string" || video.author.length > 20) {
        errors.push({ message: "Invalid author", field: "author" });
    }

    if (video.availableResolutions !== undefined) {
        if (!Array.isArray(video.availableResolutions)) {
            errors.push({ message: "Invalid available resolutions", field: "availableResolutions" });
        } else if (video.availableResolutions.some(res => !validResolutions.includes(res))) {
            errors.push({ message: "Invalid available resolutions", field: "availableResolutions" });
        }
    }

    if (video.minAgeRestriction !== undefined && video.minAgeRestriction !== null) {
        if (typeof video.minAgeRestriction !== "number" || video.minAgeRestriction < 1 || video.minAgeRestriction > 18) {
            errors.push({ message: "Invalid min age restriction", field: "minAgeRestriction" });
        }
    }

    if (video.publicationDate !== undefined && isNaN(Date.parse(video.publicationDate))) {
        errors.push({ message: "Invalid publication date", field: "publicationDate" });
    }

    if (video.canBeDownloaded !== undefined && typeof video.canBeDownloaded !== "boolean") {
        errors.push({ message: "Invalid canBeDownloaded", field: "canBeDownloaded" });
    }
    return { isValid: errors.length === 0, errors };
};



app.get("/videos", (request:Response, response: Response): void => {
    response.status(200).send(videos);
});

app.get("/videos/:id", (request: Request, response: Response): void => {
    const videoId: number = +request.params.id;
    if (isNaN(videoId)) {
        response.status(400).send({ message: "Invalid video ID" });
        return;
    }

    const specificVideo = videos.find((item) => item.id === videoId);
    if (specificVideo) {
        response.status(200).send(specificVideo);
    } else {
        response.status(404).send({ message: "Video not found" });
    }
});

app.put("/videos/:id", (request: Request, response: Response): void => {
    const videoId: number = +request.params.id;
    if (isNaN(videoId)) {
        response.status(400).send({ message: "Invalid video ID" });
        return;
    }

    const validation = validateVideo(request.body);
    if (!validation.isValid) {
        response.status(400).send({ errorsMessage: validation.errors });
        return;
    }

    const updateVideoInfo = videos.find((item) => item.id === videoId);
    if (!updateVideoInfo) {
        response.status(404).send({ message: "Video not found" });
        return;
    }

    Object.assign(updateVideoInfo, request.body);
    response.status(204).send(updateVideoInfo);
});

app.post("/videos", (request: Request, response: Response): void => {
    const validation = validateVideo(request.body);

    if (!validation.isValid) {
        response.status(400).send({ errorsMessages: validation.errors });
        return;
    }

    const newVideo: Video = {
        id: +new Date(),
        title: request.body.title,
        author: request.body.author,
        canBeDownloaded: request.body.canBeDownloaded ?? false,
        minAgeRestriction: request.body.minAgeRestriction ?? null,
        createdAt: new Date().toISOString(),
        publicationDate: request.body.publicationDate ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        availableResolutions: request.body.availableResolutions ?? [],
    };

    videos.push(newVideo);
    response.status(201).send(newVideo);
});

app.delete("/videos/:id", (request: Request, response: Response): void => {
    const videoId: number = +request.params.id;
    const videoIndex: number = videos.findIndex((video) => video.id === videoId);

    if (videoIndex === -1) {
        response.status(404).send({ message: "Video not found" });
        return;
    }

    videos.splice(videoIndex, 1);
    response.status(204).send();
});

app.delete("/testing/all-data", (request:Request, response: Response): void => {
    videos.length =0;
    response.status(204).send();
});

// Обработка ошибок
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;