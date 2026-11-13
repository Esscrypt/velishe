
--> statement-breakpoint
ALTER TABLE "academy_wishlist_entries" ADD COLUMN IF NOT EXISTS "email_sent" boolean DEFAULT false NOT NULL;

--> statement-breakpoint
ALTER TABLE "academy_wishlist_entries" ADD COLUMN IF NOT EXISTS "confirmed" boolean DEFAULT false NOT NULL;
