
--> statement-breakpoint
ALTER TABLE "academy_wishlist_entries" ADD COLUMN "email_sent" boolean DEFAULT false NOT NULL;

--> statement-breakpoint
ALTER TABLE "academy_wishlist_entries" ADD COLUMN "confirmed" boolean DEFAULT false NOT NULL;
