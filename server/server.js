import express from "express";
import cors from "cors";
import emailRoutes from "./routes/email.routes.js";

const app = express();
const port = process.env.PORT || 5000;

const corsOption = {
    origin: "http://localhost:5173",
}
app.use(express.json());

app.use(cors(corsOption));

app.get("/", (req, res) => {
    res.json({ message: "Hello World!"});
});

app.use(emailRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})