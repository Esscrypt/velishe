ALTER TABLE "home_faq_items" DROP CONSTRAINT IF EXISTS "home_faq_items_pkey";
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'home_faq_items' AND c.contype = 'p'
  ) THEN
    ALTER TABLE "home_faq_items" ADD PRIMARY KEY ("locale","id");
  END IF;
END $$;
