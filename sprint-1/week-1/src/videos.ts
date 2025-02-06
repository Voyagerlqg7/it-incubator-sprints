type Video = {
    id?: number;
    title: string;
    author: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;  // Нужно учесть null
    createdAt?: string;
    publicationDate?: string;
    availableResolutions: string[];
};

export let videos: Video[] = [

]