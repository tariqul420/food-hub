import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Add Menu",
  description: "Add a new menu item",
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
