import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Add Project",
  description: "Create a new project or portfolio item",
};

export default async function add() {
  return (
    <>
      <Card>
        <CardContent>{/* <MenuForm /> */}</CardContent>
      </Card>
    </>
  );
}
