CREATE INDEX IF NOT EXISTS "models_published_board_order_idx" ON "models" ("published","board","display_order");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "models_published_order_idx" ON "models" ("published","display_order");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "images_model_type_order_idx" ON "images" ("model_id","type","order");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_posts_published_at_idx" ON "blog_posts" ("published","published_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_posts_model_published_at_idx" ON "blog_posts" ("model_id","published","published_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_images_post_order_idx" ON "blog_images" ("post_id","order");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "academy_wishlist_entries_email_idx" ON "academy_wishlist_entries" ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "academy_wishlist_entries_phone_idx" ON "academy_wishlist_entries" ("phone_number");
