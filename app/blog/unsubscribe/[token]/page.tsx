import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/index";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { token } = await params;
  return buildPageMetadata({
    title: "Unsubscribe",
    description: "Unsubscribe from Velishe Journal.",
    path: `/blog/unsubscribe/${token}/`,
    index: false,
  });
}

export default async function BlogUnsubscribePage({ params }: PageProps) {
  const { token } = await params;
  const db = getDb();

  if (!db || !token) {
    return (
      <Centered
        title="Invalid link"
        body="This unsubscribe link is invalid."
      />
    );
  }

  const rows = await db
    .select()
    .from(schema.mailingListSubscribers)
    .where(eq(schema.mailingListSubscribers.unsubscribeToken, token))
    .limit(1);

  if (rows.length === 0) {
    return (
      <Centered
        title="Invalid link"
        body="This unsubscribe link is invalid."
      />
    );
  }

  const row = rows[0];
  if (!row.unsubscribedAt) {
    await db
      .update(schema.mailingListSubscribers)
      .set({ unsubscribedAt: new Date() })
      .where(eq(schema.mailingListSubscribers.id, row.id));
  }

  return (
    <Centered
      title="Unsubscribed"
      body="You’ve been unsubscribed."
    />
  );
}

function Centered({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-[680px] mx-auto px-4 py-24 text-center">
      <h1 className="font-serif text-3xl font-bold text-black mb-3">{title}</h1>
      <p className="text-gray-600">{body}</p>
    </div>
  );
}
