import express from "express";
import pool from "../lib/db.ts";

const router = express.Router();

// /api/testimonials
router.get("/", async (req, res) => {
   try {
     const { id } = req.query;

     let rows = await pool.query("SELECT * FROM testimonials");
    //  if(id) {
    //     [rows] = await pool.query(
    //         "SELECT * FROM testimonials WHERE id = ?",
    //         [id]
    //     );
    //  } else {
    //     [rows] = await pool.query("SELECT * FROM testimonials");
    //  }

     res.json(rows);
   } catch (err: any) {
     console.log("Failed to fetch products", err.message);
     res.status(500).json({ error: "Failed to fetch products" });
   }
});

export default router;