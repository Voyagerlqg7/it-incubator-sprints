type Video = {
    id?: number;
    title: string;
    author: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;  // Нужно учесть null
    createdAt?: string;
    publicationDate?: string;
    availableResolutions?: string[];
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
        availableResolutions: [
            "P144"
        ]
    }
]