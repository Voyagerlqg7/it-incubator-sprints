import express from "express";
import { Request, Response } from "express";

export const app = express();
const port = process.env.PORT || 6419;

// Тип для видео
type Video = {
    id?: number;
    title: string;
    author: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null; // Учитываем null
    createdAt?: string;
    publicationDate?: string;
    availableResolutions: string[];
};

// Инициализация массива видео
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

app.use(express.json());

const validateVideo = (video: Partial<Video>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!video.title || typeof video.title !== "string" || video.title.length > 40) errors.push("Incorrect title");
    if (!video.author || typeof video.author !== "string" || video.author.length > 20) errors.push("Incorrect author");
    if (!video.availableResolutions || !Array.isArray(video.availableResolutions) || video.availableResolutions.length === 0) errors.push("Incorrect resolutions");
    if (video.minAgeRestriction !== null && (typeof video.minAgeRestriction !== "number" || video.minAgeRestriction < 1 || video.minAgeRestriction > 18)) errors.push("Incorrect minAgeRestriction");
    return { isValid: errors.length === 0, errors };
};
// Получить все видео
app.get("/videos", (_, response: Response): void => {
    response.status(200).send(videos);
});
// Получить видео по ID
app.get("/videos/:id", (request: Request, response: Response): void => {
    const videoId: number = +request.params.id;
    if (isNaN(videoId) || videoId < 0) {
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

// Обновить видео по ID
app.put("/videos/:id", (request: Request, response: Response): void => {

});

// Создать новое видео
app.post("/videos", (request: Request, response: Response): void => {

});

// Удалить видео по ID
app.delete("/videos/:id", (request: Request, response: Response): void => {

});

// Удалить все данные
app.delete("/testing/all-data", (_, response: Response): void => {

});

// Запуск сервера
app.listen(port, () => {
    console.log("Example app listening on port", port);
});