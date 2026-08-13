import express from "express";
import productsRouter from "./routes/products.ts";
import checkoutSession from './routes/checkout.ts';
import cors from "cors";

const app = express();

// enable CORS for requests from a specific url (localhost:3000)
app.use(cors({
    origin: ["http://localhost:3000", "https://rach-dev.vercel.app/"],
    optionsSuccessStatus: 200,
}))

const PORT = process.env.PORT || 5004;

app.use(express.json()); // parse json request bodies through express
app.use("/api/products", productsRouter);
app.use("/api", checkoutSession);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})