import type { Metadata } from "next";
import { MealInputForm } from "./components/MealForm";

export const metadata: Metadata = {
  title: "Analyze a meal",
};

export default function Home() {
  return <MealInputForm />;
}
