ALTER TABLE "images" ALTER COLUMN "model_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "models" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "display_order" integer DEFAULT 0 NOT NULL;