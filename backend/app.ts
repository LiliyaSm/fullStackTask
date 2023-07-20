import express from "express";

const app = express();

app.use((request, response) => {
    response.json({ message: 'Hey! This is your server response!' });  
});

export default app;