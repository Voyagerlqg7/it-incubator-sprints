import express from "express";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();
const app = express();
const port = process.env.PORT || 6419;

app.use(express.json());

type Video = {
    id?: number;
    title: string;
    author: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    createdAt?: string;
    publicationDate?: string;
    availableResolutions: string[];
};

export let videos: Video[] = [
    {
        id: 0,
        title: "some title",
        author: "some author",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2025-02-06T21:21:53.110Z",
        publicationDate: "2025-02-06T21:21:53.110Z",
        availableResolutions: ["P144"],
    },
];

const validateVideo = (video: Partial<Video>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const validResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

    if (!video.title || typeof video.title !== "string" || video.title.length > 40) errors.push("Incorrect title");
    if (!video.author || typeof video.author !== "string" || video.author.length > 20) errors.push("Incorrect author");
    if (!video.availableResolutions || !Array.isArray(video.availableResolutions)) errors.push("Incorrect resolutions");
    if (video.availableResolutions && video.availableResolutions.some(res => !validResolutions.includes(res))) errors.push("Invalid resolution");
    if (video.minAgeRestriction !== null && (typeof video.minAgeRestriction !== "number" || video.minAgeRestriction < 1 || video.minAgeRestriction > 18)) errors.push("Incorrect minAgeRestriction");
    if (video.publicationDate && isNaN(Date.parse(video.publicationDate))) errors.push("Invalid publicationDate");

    return { isValid: errors.length === 0, errors };
};

app.get("/videos", (_, response: Response): void => {
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
    response.status(200).send(updateVideoInfo);
});

app.post("/videos", (request: Request, response: Response): void => {
    const validation = validateVideo(request.body);
    if (!validation.isValid) {
        response.status(400).send({ errorsMessage: validation.errors });
        return;
    }

    const newVideo: Video = {
        id: +new Date(),
        title: request.body.title,
        author: request.body.author,
        canBeDownloaded: request.body.canBeDownloaded ?? false,
        minAgeRestriction: request.body.minAgeRestriction ?? null,
        createdAt: new Date().toISOString(),
        publicationDate: request.body.publicationDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        availableResolutions: request.body.availableResolutions,
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

app.delete("/testing/all-data", (_, response: Response): void => {
    videos = [];
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