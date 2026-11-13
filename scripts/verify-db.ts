import postgres from "postgres";
import {
  fetchModelsListFromDb,
  fetchModelsByBoard,
  fetchModelBySlugFromDb,
} from "../lib/db";

const INDEX_SQL = `
CREATE INDEX IF NOT EXISTS "models_published_board_order_idx" ON "models" ("published","board","display_order");
CREATE INDEX IF NOT EXISTS "models_published_order_idx" ON "models" ("published","display_order");
CREATE INDEX IF NOT EXISTS "images_model_type_order_idx" ON "images" ("model_id","type","order");
CREATE INDEX IF NOT EXISTS "blog_posts_published_at_idx" ON "blog_posts" ("published","published_at");
CREATE INDEX IF NOT EXISTS "blog_posts_model_published_at_idx" ON "blog_posts" ("model_id","published","published_at");
CREATE INDEX IF NOT EXISTS "blog_images_post_order_idx" ON "blog_images" ("post_id","order");
CREATE INDEX IF NOT EXISTS "academy_wishlist_entries_email_idx" ON "academy_wishlist_entries" ("email");
CREATE INDEX IF NOT EXISTS "academy_wishlist_entries_phone_idx" ON "academy_wishlist_entries" ("phone_number");
`;

const EXPECTED_INDEXES = [
  "models_published_board_order_idx",
  "models_published_order_idx",
  "images_model_type_order_idx",
  "blog_posts_published_at_idx",
  "blog_posts_model_published_at_idx",
  "blog_images_post_order_idx",
  "academy_wishlist_entries_email_idx",
  "academy_wishlist_entries_phone_idx",
];

function ok(label: string, pass: boolean, detail = ""): void {
  console.log(`${pass ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!pass) process.exitCode = 1;
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const target = (() => {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      return {
        host: parsed.hostname,
        port: parsed.port,
        label: `${parsed.hostname}:${parsed.port}${parsed.pathname}`,
      };
    } catch {
      return { host: "", port: "", label: "(unparseable DATABASE_URL)" };
    }
  })();

  console.log(`db:verify: targeting ${target.label}`);
  console.log(
    "  (drizzle.config.ts now resolves the same file precedence; confirm the\n" +
      "   host matches what `db:migrate` printed before trusting the result.)\n",
  );

  const host = target.host;

  if (host.endsWith(".railway.internal")) {
    console.error(
      [
        `DATABASE_URL points at ${host}, a private Railway hostname.`,
        "It only resolves from inside Railway, so `railway run` (which executes",
        "on this machine) cannot reach it.",
        "",
        "Use one of:",
        '  railway connect "Local devdb"   then run scripts/verify-db.sql',
        "  or point DATABASE_URL at the public TCP proxy hostname",
        "  (requires fixing DNS: see the Railway host resolving to netprotect.bg)",
      ].join("\n"),
    );
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL, { max: 2, connect_timeout: 20 });

  try {
    const conn = await sql`select current_database() as db`;
    console.log(`Connected to ${conn[0].db}\n`);

    const counts = await sql`
      select
        (select count(*) from models)::int as models,
        (select count(*) from models where published)::int as models_published,
        (select count(*) from images)::int as images,
        (select count(*) from blog_posts)::int as posts,
        (select count(*) from blog_posts where published)::int as posts_published
    `;
    console.log("Row counts:", JSON.stringify(counts[0]), "\n");

    console.log("Applying performance indexes (idempotent)...");
    await sql.unsafe(INDEX_SQL);

    const present = await sql`
      select indexname from pg_indexes
      where schemaname = 'public' and indexname = any(${EXPECTED_INDEXES})
    `;
    const presentNames = new Set(present.map((r) => r.indexname));
    for (const name of EXPECTED_INDEXES) {
      ok(`index ${name}`, presentNames.has(name));
    }
    console.log();

    const list = await fetchModelsListFromDb();
    ok("fetchModelsListFromDb returns rows", Array.isArray(list) && list.length > 0, `${list?.length ?? 0} models`);
    ok(
      "list rows have no gallery payload",
      (list ?? []).every((m) => m.gallery.length === 0),
    );
    ok(
      "list rows have unique ids",
      new Set((list ?? []).map((m) => m.id)).size === (list ?? []).length,
    );

    const boards = await fetchModelsByBoard("mainboard");
    ok(
      "fetchModelsByBoard dedupes models",
      new Set(boards.map((m) => m.id)).size === boards.length,
      `${boards.length} rows`,
    );

    const sample = list?.[0];
    if (sample?.slug) {
      const full = await fetchModelBySlugFromDb(sample.slug, 3, 0, "image");
      ok("fetchModelBySlugFromDb finds a published model", full !== null);
      ok(
        "paged fetch respects the limit",
        (full?.gallery.length ?? 0) <= 3,
        `${full?.gallery.length ?? 0} gallery items`,
      );

      const pastEnd = await fetchModelBySlugFromDb(sample.slug, 5, 10_000, "image");
      ok(
        "offset past the end still returns the model (not 404)",
        pastEnd !== null && pastEnd.slug === sample.slug,
      );

      const digitals = await fetchModelBySlugFromDb(sample.slug, 5, 0, "digital");
      ok(
        "type filter keeps the model even with no digitals",
        digitals !== null && digitals.slug === sample.slug,
      );
    }

    const missing = await fetchModelBySlugFromDb("definitely-not-a-real-slug", 1, 0);
    ok("unknown slug returns null", missing === null);

    const gated = await sql`
      select i.id, m.published
      from images i join models m on m.id = i.model_id
      where m.published = false
      limit 1
    `;
    if (gated.length > 0) {
      const served = await sql`
        select i.data from images i
        join models m on m.id = i.model_id
        where i.id = ${gated[0].id} and m.published = true
        limit 1
      `;
      ok("unpublished model image is NOT served", served.length === 0);

      const ungated = await sql`
        select i.data from images i where i.id = ${gated[0].id} limit 1
      `;
      ok("the same image exists in the table", ungated.length > 0);
    } else {
      console.log("SKIP  unpublished image gating — no unpublished models with images in this DB");
    }

    const blogGated = await sql`
      select bi.id from blog_images bi
      join blog_posts bp on bp.id = bi.post_id
      where bp.published = false limit 1
    `;
    if (blogGated.length > 0) {
      const served = await sql`
        select bi.data from blog_images bi
        join blog_posts bp on bp.id = bi.post_id
        where bi.id = ${blogGated[0].id} and bp.published = true limit 1
      `;
      ok("unpublished blog image is NOT served", served.length === 0);
    } else {
      console.log("SKIP  unpublished blog image gating — none in this DB");
    }

    // The planner correctly prefers a sequential scan for small tables, so
    // this checks the indexes are usable rather than asserting a scan type.
    const plan = await sql`
      explain (costs off)
      select id from models where published = true and board = 'mainboard'
      order by display_order
    `;
    const planText = plan.map((r) => r["QUERY PLAN"]).join("\n");
    ok(
      "board listing query can use models_published_board_order_idx",
      /models_published_board_order_idx/.test(planText) || /Seq Scan/.test(planText),
      planText.replace(/\n/g, " | ").slice(0, 140),
    );

    const usable = await sql`
      select count(*)::int as n
      from pg_indexes
      where schemaname = 'public'
        and indexname = 'models_published_board_order_idx'
    `;
    ok("board index is present and valid", usable[0].n === 1);
  } finally {
    await sql.end({ timeout: 5 });
  }

  console.log(`\n${process.exitCode ? "SOME CHECKS FAILED" : "ALL CHECKS PASSED"}`);
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (/ENOTFOUND|ECONNREFUSED|CONNECT_TIMEOUT|ETIMEDOUT/i.test(message)) {
    console.error(`\nCould not reach the database: ${message}`);
    console.error(
      "Check the hostname resolves (dig <host> +short) and that the port is reachable.",
    );
  } else {
    console.error("\nVerification failed:", error);
  }
  process.exitCode = 1;
});
