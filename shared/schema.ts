import { pgTable, text, serial, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // "pie" or "crust"
  ingredients: json("ingredients").$type<string[]>().notNull(),
  instructions: text("instructions").notNull(),
  notes: text("notes"),
  imageType: text("imageType").notNull(),
  tags: json("tags").$type<string[]>().notNull().default([]),
  bakeTemp: integer("bakeTemp"), // null for no-bake recipes
  difficulty: text("difficulty").notNull().default("medium"), // "easy", "medium", "hard"
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({ id: true });

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

export const pieImages = [
  "berry-red",     // Red berry pie
  "berry-blue",    // Blueberry pie
  "chocolate",     // Chocolate pie
  "lattice",       // Classic lattice pattern
  "cheesecake",    // Simple cheesecake
] as const;

export const crustImages = [
  "classic",       // Traditional pie crust
  "graham",        // Graham cracker crust
  "cookie",        // Cookie crust
] as const;

// Available recipe tags
export const recipeTags = {
  baking: ["baked", "no-bake"],
  filling: ["fruit", "chocolate", "cream", "custard", "misc"],
  status: ["tried", "to-do"]
} as const;

// Tag colors for rendering
export const tagColors: Record<string, { bg: string; text: string }> = {
  // Baking tags
  "baked": { bg: "bg-red-100", text: "text-red-800" },
  "no-bake": { bg: "bg-blue-100", text: "text-blue-800" },

  // Filling tags
  "fruit": { bg: "bg-pink-100", text: "text-pink-800" },
  "chocolate": { bg: "bg-brown-100", text: "text-brown-800" },
  "cream": { bg: "bg-yellow-100", text: "text-yellow-800" },
  "custard": { bg: "bg-orange-100", text: "text-orange-800" },
  "misc": { bg: "bg-purple-100", text: "text-purple-800" },

  // Status tags
  "tried": { bg: "bg-green-100", text: "text-green-800" },
  "to-do": { bg: "bg-blue-100", text: "text-blue-800" },

  // Difficulty tags
  "easy": { bg: "bg-green-100", text: "text-green-800" },
  "medium": { bg: "bg-yellow-100", text: "text-yellow-800" },
  "hard": { bg: "bg-red-100", text: "text-red-800" },
};

export type PieImageType = typeof pieImages[number];
export type CrustImageType = typeof crustImages[number];