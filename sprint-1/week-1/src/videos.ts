export type Video = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;  // Нужно учесть null
    createdAt: string;  // В TypeScript тип Date хранится иначе, лучше использовать string
    publicationDate: string;
    availableResolutions: string[];  // Должен быть массив строк, а не один элемент
};



export let videos: Video[] = [
    {
        id: 0,
        title: "Film-0",
        author: "Author of film 0",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2025-02-06T12:31:15.925Z",
        publicationDate: "2025-02-06T12:31:15.925Z",
        availableResolutions: [
            "P144"
        ]
    },
    {
        id: 1,
        title: "Film-1",
        author: "Author of film-1",
        canBeDownloaded: true,
        minAgeRestriction: 18,
        createdAt: "2025-02-06T12:31:15.925Z",
        publicationDate: "2025-02-06T12:31:15.925Z",
        availableResolutions: [
            "P360"
        ]
    },
    {
        id: 2,
        title: "Film-2",
        author: "Author of film-2",
        canBeDownloaded: false,
        minAgeRestriction: 16,
        createdAt: "2025-02-06T12:31:15.925Z",
        publicationDate: "2025-02-06T12:31:15.925Z",
        availableResolutions: [
            "P480"
        ]
    },
    {
        id: 3,
        title: "Film-3",
        author: "Author of film-3",
        canBeDownloaded: true,
        minAgeRestriction: 6,
        createdAt: "2025-02-06T12:31:15.925Z",
        publicationDate: "2025-02-06T12:31:15.925Z",
        availableResolutions: [
            "P1080"
        ]
    }
]

