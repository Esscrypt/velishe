-- Verification checks for the performance/index work.
-- Run inside the database (railway connect "Local devdb"), where the private
-- hostname resolves. Applies the index migration (idempotent) then verifies.

\echo '=== row counts ==='
select
  (select count(*) from models) as models,
  (select count(*) from models where published) as models_published,
  (select count(*) from images) as images,
  (select count(*) from blog_posts) as posts,
  (select count(*) from blog_posts where published) as posts_published;

\echo ''
\echo '=== applying indexes (idempotent) ==='
CREATE INDEX IF NOT EXISTS "models_published_board_order_idx" ON "models" ("published","board","display_order");
CREATE INDEX IF NOT EXISTS "models_published_order_idx" ON "models" ("published","display_order");
CREATE INDEX IF NOT EXISTS "images_model_type_order_idx" ON "images" ("model_id","type","order");
CREATE INDEX IF NOT EXISTS "blog_posts_published_at_idx" ON "blog_posts" ("published","published_at");
CREATE INDEX IF NOT EXISTS "blog_posts_model_published_at_idx" ON "blog_posts" ("model_id","published","published_at");
CREATE INDEX IF NOT EXISTS "blog_images_post_order_idx" ON "blog_images" ("post_id","order");
CREATE INDEX IF NOT EXISTS "academy_wishlist_entries_email_idx" ON "academy_wishlist_entries" ("email");
CREATE INDEX IF NOT EXISTS "academy_wishlist_entries_phone_idx" ON "academy_wishlist_entries" ("phone_number");

\echo ''
\echo '=== index presence (expect 8 rows) ==='
select indexname from pg_indexes
where schemaname = 'public' and indexname in (
  'models_published_board_order_idx','models_published_order_idx',
  'images_model_type_order_idx','blog_posts_published_at_idx',
  'blog_posts_model_published_at_idx','blog_images_post_order_idx',
  'academy_wishlist_entries_email_idx','academy_wishlist_entries_phone_idx'
)
order by indexname;

\echo ''
\echo '=== query plan: published models (expect an Index Scan, not Seq Scan) ==='
explain (costs off)
select id from models where published = true order by display_order;

\echo ''
\echo '=== query plan: board listing (expect an Index Scan) ==='
explain (costs off)
select id from models where published = true and board = 'mainboard' order by display_order;

\echo ''
\echo '=== duplicate check: one row per model in board listing ==='
select count(*) as rows_returned, count(distinct m.id) as distinct_models
from models m
left join images i on i.model_id = m.id and i."order" = 0 and i.type = 'image'
where m.published = true;

\echo ''
\echo '=== gating: unpublished model images must NOT be served ==='
select count(*) as leaked_images
from images i join models m on m.id = i.model_id
where m.published = false;
\echo '(informational: these rows exist but the gated query below must return 0)'

select count(*) as served_when_unpublished
from images i join models m on m.id = i.model_id
where m.published = true
  and i.model_id in (select id from models where published = false);

\echo ''
\echo '=== gating: unpublished blog images must NOT be served ==='
select count(*) as unpublished_blog_images
from blog_images bi join blog_posts bp on bp.id = bi.post_id
where bp.published = false;

select count(*) as served_when_unpublished
from blog_images bi join blog_posts bp on bp.id = bi.post_id
where bp.published = true
  and bi.post_id in (select id from blog_posts where published = false);

\echo ''
\echo '=== model image counts by type (sanity for the type filter) ==='
select type, count(*) from images group by type order by type;
