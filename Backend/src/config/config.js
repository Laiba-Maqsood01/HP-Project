import dotenv from "dotenv"

dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not existed in environment variables.");
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not existed in environment variables.");
}


if(!process.env.GOOGLE_APP_PASSWORD){
    throw new Error("GOOGLE_APP_PASSWORD is not defined in environment variables.");
}

if(!process.env.GOOGLE_USER){
    throw new Error("GOOGLE_USER is not defined in environment variables.");
}

if(!process.env.EMAIL_ADMIN){
    throw new Error("EMAIL_ADMIN is not defined in environment variables.");
}

if(!process.env.ADMIN_PASSWORD){
    throw new Error("ADMIN_PASSWORD is not defined in environment variables.");
}

if(!process.env.RESEND_API_KEY){
    throw new Error("RESEND_API_KEY is not defined in environment variables.");
}



const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,
    GOOGLE_USER: process.env.GOOGLE_USER,
    EMAIL_ADMIN: process.env.EMAIL_ADMIN,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    RESEND_API_KEY: process.env.RESEND_API_KEY
}

export default config