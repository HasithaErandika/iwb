import { auth } from "@/auth";
import HomeClient from "./home-client";

export default async function Home() {
  const session = await auth();

  return <HomeClient session={session} />;
}
