import { getPublicClock } from "@/app/actions";
import { redirect } from "next/navigation";
import EmbedClient from "./EmbedClient";

/**
 * Server component for the embed route.
 * Fetches clock data without authentication requirement and passes it to the client component.
 */
export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { id } = await params;
  const search = await searchParams;

  let clock;
  try {
    clock = await getPublicClock(id);
  } catch {
    redirect("/");
  }

  const transparent = search.transparent === "true";
  const compact = search.compact === "true";

  return (
    <EmbedClient
      endDate={clock.runwayEndDate}
      name={clock.name}
      transparent={transparent}
      compact={compact}
    />
  );
}
