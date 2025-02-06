import express from "express";
import { Request, Response } from "express";

const app = express();
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

// Получить все видео
app.get("/videos", (_, response: Response): void => {
    response.status(200).send(videos);
});

// Получить видео по ID
app.get("/videos/:id", (request: Request, response: Response): void => {
    const videoId: number = +request.params.id;

    // Проверка на корректность ID
    if (isNaN(videoId) || videoId < 0) {
        response.status(400).send({});
        return;
    }

    const specificVideo = videos.find((item) => item.id === videoId);

    if (specificVideo) {
        response.status(200).send(specificVideo);
    } else {
        response.status(404).send({});
    }
});

// Обновить видео по ID
app.put("/videos/:id", (request: Request, response: Response): void => {
    const ReqTitle: string = request.body.title;
    const ReqAuthor: string = request.body.author;
    const ReqResolution: string[] = request.body.availableResolutions;
    const ReqMinAgeRestriction: number | null = request.body.minAgeRestriction;

    // Валидация входных данных
    if (
        typeof ReqTitle !== "string" ||
        !ReqTitle.trim() ||
        ReqTitle.length > 40 ||
        typeof ReqAuthor !== "string" ||
        !ReqAuthor.trim() ||
        ReqAuthor.length > 20 ||
        !Array.isArray(ReqResolution) ||
        ReqResolution.length === 0 ||
        (ReqMinAgeRestriction !== null &&
            (typeof ReqMinAgeRestriction !== "number" ||
                ReqMinAgeRestriction < 1 ||
                ReqMinAgeRestriction > 18))
    ) {
        response.status(400).send({
            errorsMessage: [
                {
                    message: "Incorrect title/author/resolutions/minAgeRestriction",
                    field: "title/author/resolutions/minAgeRestriction",
                },
            ],
        });
        return;
    }

    // Поиск видео для обновления
    const updateVideoInfo = videos.find((item) => item.id === +request.params.id);
    if (!updateVideoInfo) {
        response.status(404).send({});
        return;
    }

    // Обновление данных видео
    updateVideoInfo.title = ReqTitle;
    updateVideoInfo.author = ReqAuthor;
    updateVideoInfo.availableResolutions = ReqResolution;
    updateVideoInfo.canBeDownloaded = request.body.canBeDownloaded;
    updateVideoInfo.minAgeRestriction = ReqMinAgeRestriction;
    updateVideoInfo.publicationDate = request.body.publicationDate;

    response.status(200).send(updateVideoInfo);
});

// Создать новое видео
app.post("/videos", (request: Request, response: Response): void => {
    const ReqTitle: string = request.body.title;
    const ReqAuthor: string = request.body.author;
    const ReqResolution: string[] = request.body.availableResolutions;

    // Валидация входных данных
    if (
        typeof ReqTitle !== "string" ||
        !ReqTitle.trim() ||
        ReqTitle.length > 40 ||
        typeof ReqAuthor !== "string" ||
        !ReqAuthor.trim() ||
        ReqAuthor.length > 20 ||
        !Array.isArray(ReqResolution) ||
        ReqResolution.length === 0
    ) {
        response.status(400).send({
            errorsMessage: [
                {
                    message: "Incorrect title/author/resolutions",
                    field: "title/author/availableResolutions",
                },
            ],
        });
        return;
    }

    // Создание нового видео
    const newVideo: Video = {
        id: +new Date(),
        title: ReqTitle,
        author: ReqAuthor,
        canBeDownloaded: request.body.canBeDownloaded ?? false,
        minAgeRestriction: request.body.minAgeRestriction ?? null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +24 часа
        availableResolutions: ReqResolution,
    };

    videos.push(newVideo);
    response.status(201).send(newVideo);
});

// Удалить видео по ID
app.delete("/videos/:id", (request: Request, response: Response): void => {
    const videoId = +request.params.id;
    const videoIndex = videos.findIndex((video) => video.id === videoId);

    if (videoIndex === -1) {
        response.status(404).send({});
        return;
    }

    videos.splice(videoIndex, 1);
    response.status(204).send();
});

// Удалить все данные
app.delete("/testing/all-data", (_, response: Response): void => {
    videos.length = 0;
    response.status(204).send();
});

// Запуск сервера
app.listen(port, () => {
    console.log("Example app listening on port", port);
});