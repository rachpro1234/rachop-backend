import express from "express";
import productsRouter from "./routes/products.ts";
import cors from "cors";

const app = express(); // initialize express app

// enable CORS for requests from a specific url (localhost:3000)
app.use(cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
}))

// const allowedOrigins = ["http://localhost:3000", "http://localhost:3000/"];

// app.use((req, res, next) => {
//     const origin:string = req.headers.origin!;

//     if(allowedOrigins.includes(origin)) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//         res.setHeader('Vary', 'Origin');
//     }
//     next();
// })

const PORT = process.env.PORT || 5004;

app.use(express.json()); // parse json request bodies through express
app.use("/api/products", productsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})