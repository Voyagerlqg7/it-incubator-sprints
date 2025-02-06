import {config} from 'dotenv';
config();
export const SETTINGS = {
    PORT:process.env.PORT || 6419,
    PATH:{
        VIDEOS: '/videos',
    }
}