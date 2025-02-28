import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertRecipeSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/recipes", async (_req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  app.get("/api/recipes/:id", async (req, res) => {
    const recipe = await storage.getRecipe(Number(req.params.id));
    if (!recipe) {
      res.status(404).json({ message: "Recipe not found" });
      return;
    }
    res.json(recipe);
  });

  app.post("/api/recipes", async (req, res) => {
    const parsed = insertRecipeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid recipe data" });
      return;
    }
    const recipe = await storage.createRecipe(parsed.data);
    res.json(recipe);
  });

  app.put("/api/recipes/:id", async (req, res) => {
    const parsed = insertRecipeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid recipe data" });
      return;
    }
    const recipe = await storage.updateRecipe(Number(req.params.id), parsed.data);
    res.json(recipe);
  });

  app.delete("/api/recipes/:id", async (req, res) => {
    await storage.deleteRecipe(Number(req.params.id));
    res.status(204).end();
  });

  app.get("/api/recipes/search/:query", async (req, res) => {
    const recipes = await storage.searchRecipes(req.params.query);
    res.json(recipes);
  });

  return createServer(app);
}
