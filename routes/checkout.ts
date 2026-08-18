import express from "express";
// import type { Request, Response } from "express";
import Stripe from "stripe";
import pool from '../lib/db.ts'

const router = express.Router();

// expApp.use(express.json());

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-07-29.dahlia",
});

interface CartItem {
    slug: string;
    quantity: number;
}

// create the stripe checkout session
router.post('/checkout-session', async (req, res) => {
    try {

        const { items }: { items: CartItem[] } = req.body;

        if(!items || items.length === 0) {
            return res.status(500).json({ error: "No item Provided" });
        }

        const lineItems = [];

        for(const cartItem of items) {
            const [rows]: any = await pool.query(
                "SELECT * FROM products WHERE slug = ?",
                 [cartItem.slug]
            );

            if(rows.length === 0) {
                return res.status(404).json({ error: `Product not Found ${cartItem.slug}` })
            };

            const product = rows[0];

            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: { name: product.title_key },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: cartItem.quantity,
            });
        };


       
        const session = await stripe.checkout.sessions.create({
            ui_mode: "embedded_page",
            mode: "payment",
            line_items: lineItems,
            return_url: `${process.env.FRONTEND_URL}/return?session_id={CHECKOUT_SESSION_ID}`
        });

        res.json({ clientSecret: session.client_secret });
        console.log("checkout creation is successfully created", lineItems);
    } catch (error: any) {
        console.log("checkout creation failed", error.message);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

// extra route to retrieve the finished checkout session price data
router.get("/checkout-session/session/:sessionId", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        res.json({
            amountTotal: session.amount_total,
            currency: session.currency,
            created: session.created,
            paymentStatus: session.payment_status,
            id: session.id 
        });

        console.log("checkout session data is successfully retrieved", session);
    } catch (error: any) {
        console.error("Failed to retrieve session", error.message);
        res.status(500).json({ error: "failed to retrieve session" });
    }
});

export default router;