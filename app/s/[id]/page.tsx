import { redirect } from "next/navigation";
import { getScenario } from "@/app/actions";
import ScenarioPage from "./ScenarioClient";

export default async function ScenarioServerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const scenario = await getScenario(id);
    return <ScenarioPage scenario={scenario} />;
  } catch (error) {
    redirect("/sign-in");
  }
}

