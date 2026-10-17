import pool from "../lib/db.ts";
import { testimonialData } from "../data/testimonial-data.ts";

async function MigrateTestimonial() {
    for(const item of testimonialData) {
        try {
            await pool.query(
                `INSERT INTO products (category, img, title_key, desc_key, slug, price, prev_price)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                 [
                    "Hero",
                    item.img,
                    item.name,
                    item.position,
                    item.testimonial
                 ]
            );
            // console.log(`INSERTED: ${item.slug}`);
        } catch (err: any) {
            console.log(`Failed to insert: `, err.message)
        }
    }

    console.log("Migration complete");
    process.exit();
};

MigrateTestimonial();