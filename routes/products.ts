import express, { Router } from "express";
import pool from "../lib/db.ts";

const router = express.Router();

// GET /api/products - all products (optionally) filtered by category
router.get("/", async (req, res) => {
   try {
     const { category } = req.query;

     let rows;
     if(category) {
        [rows] = await pool.query(
            "SELECT * FROM products WHERE category = ?",
            [category]
        );
     } else {
        [rows] = await pool.query("SELECT * FROM products");
     }

     res.json(rows);
   } catch (err: any) {
     console.log("Failed to fetch products", err.message);
     res.status(500).json({ error: "Failed to fetch products" });
   }
});

// GET /api/products/:slug — one product, for the product detail page
router.get("/:slug", async (req, res) => {
    try {
     const { slug } = req.params;

     const [rows]: any = await pool.query(
        "SELECT * FROM products WHERE slug = ?",
        [slug]
     );

     if(rows.length === 0) {
        return res.status(404).json({ error: "product not found" })
     }

     res.json(rows[0]);
    } catch (err: any) {
     console.log("Failed to fetch product:", err.message);
     res.status(500).json({ error: "Failed to fetch product" });
    }
});







export default Router;