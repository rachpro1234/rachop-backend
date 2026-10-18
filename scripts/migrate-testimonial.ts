import pool from "../lib/db.ts";
import { testimonialData } from "../data/testimonial-data.ts";

async function MigrateTestimonial() {
    for(const item of testimonialData) {
        try {
            await pool.query(
                `INSERT INTO testimonials (img, person_name, person_position, person_testimonial)
                 VALUES (?, ?, ?, ?)`,
                 [
                    item.img,
                    item.person_name,
                    item.person_position,
                    item.person_testimonial
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