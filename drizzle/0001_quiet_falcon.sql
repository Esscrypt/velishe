ALTER TABLE "models" ADD COLUMN IF NOT EXISTS "booked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN IF NOT EXISTS "target_location" text;
