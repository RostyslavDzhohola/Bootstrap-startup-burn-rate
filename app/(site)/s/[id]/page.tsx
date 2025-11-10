import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getClock } from "@/app/actions";
import ScenarioPage from "./ScenarioClient";

export default async function ScenarioServerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  let clock;
  try {
    clock = await getClock(id);
  } catch {
    redirect("/sign-in");
  }

  return <ScenarioPage scenario={clock} isSignedIn={!!userId} />;
}

