import express from "express";
import productsRouter from "./routes/products.ts";
import checkoutSession from './routes/checkout.ts';
import cors from "cors";
import sequelize from "./common/database.ts";
import defineUser from "./common/models/User.ts";
import authRoutes from './authorisation/routes.ts';

import userRoutes from "./users/routes.ts";

const app = express();

// enable CORS for requests from a specific url (localhost:3000)
app.use(cors({
    origin: ["http://localhost:3000", "https://rach-dev.vercel.app/"],
    optionsSuccessStatus: 200,
}))

const User = defineUser(sequelize);

sequelize.sync();

const PORT = process.env.PORT || 5004;

app.use(express.json()); // parse json request bodies through express
app.use("/api/products", productsRouter);
app.use("/api", checkoutSession);
app.use("/api/auth", authRoutes); // Auth Routes
app.use('/api/user', userRoutes); // User Routes


app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'something went wrong',
    });
    next();
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});