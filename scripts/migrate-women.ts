import pool from "../lib/db.ts";
import { womenItems } from "../data/women-products.ts";

async function MigrateWomen() {
    for(const item of womenItems) {
        try {
            await pool.query(
                `INSERT INTO products (category, img, title_key, desc_key, slug, price, prev_price)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                 [
                    "Women",
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

MigrateWomen();