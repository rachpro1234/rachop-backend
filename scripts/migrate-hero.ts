import pool from "../lib/db.ts";
import { heroItems } from "../data/hero-products.ts";

async function MigrateHero() {
    for(const item of heroItems) {
        try {
            await pool.query(
                `INSERT INTO products (category, img, title_key, desc_key, slug, price, prev_price)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                 [
                    "Hero",
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

MigrateHero();