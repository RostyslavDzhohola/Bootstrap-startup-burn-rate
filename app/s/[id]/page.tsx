import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getScenario } from "@/app/actions";
import ScenarioPage from "./ScenarioClient";

export default async function ScenarioServerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  let scenario;
  try {
    scenario = await getScenario(id);
  } catch {
    redirect("/sign-in");
  }

  return <ScenarioPage scenario={scenario} isSignedIn={!!userId} />;
}
