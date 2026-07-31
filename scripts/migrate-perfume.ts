import pool from "../lib/db.ts";
import { perfumeItems } from "../data/prefume-products.ts";

async function MigratePerfume() {
    for(const item of perfumeItems) {
        try {
            await pool.query(
                `INSERT INTO products (category, img, title_key, desc_key, slug, price, prev_price)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                 [
                    "Perfume",
                    item.img,
                    item.title,
                    item.desc_key,
                    item.slug,
                    item.price,
                    item.prevPrice,
                 ]
            );
            console.log(`INSERTED: ${item.slug}`);
        } catch (err: any) {
            console.log(`Failed to insert: ${item.slug}`, err.message)
        }
    }

    console.log("Migration complete");
    process.exit();
};

MigratePerfume();