import express from "express";
import productsRouter from "./routes/products.ts";

const app = express(); // initialize express app
const PORT = 5000;

app.use(express.json()); // parse json request bodies through express
app.use("/api/products", productsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})