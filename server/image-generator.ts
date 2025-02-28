import { pieVariations, crustVariations } from "@shared/schema";

// The function now returns an imageType identifier instead of a URL
export async function generatePieImage(type: string, flavor: string): Promise<string> {
  // Map the flavor to one of our pre-defined SVG variations
  if (type === "pie") {
    const pieMatch = pieVariations.find(p => 
      p.flavor.toLowerCase().includes(flavor.toLowerCase())
    );
    return pieMatch?.id || "berry-red"; // Default to berry-red if no match
  } else if (type === "crust") {
    const crustMatch = crustVariations.find(c => 
      c.style.toLowerCase().includes(flavor.toLowerCase())
    );
    return crustMatch?.id || "classic"; // Default to classic if no match
  }
  return "classic";
}

// Pre-defined variations for pies and crusts are now moved to schema.ts
export { pieVariations, crustVariations };