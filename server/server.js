import express from "express";
import cors from "cors";
import emailRoutes from "./routes/email.routes.js";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 5000;

const corsOption = {
    origin: "*",
    // origin: "https://full-stack-email-app.vercel.app",
    origin: "http://localhost:5173",
}
app.use(express.json());

app.use(cors(corsOption));

app.get("/api", (req, res) => {
    res.json({ message: "API is live"});
});

app.use(emailRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../client/dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})