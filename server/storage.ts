import { recipes, type Recipe, type InsertRecipe } from "@shared/schema";

export interface IStorage {
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: InsertRecipe): Promise<Recipe>;
  deleteRecipe(id: number): Promise<void>;
  searchRecipes(query: string): Promise<Recipe[]>;
}

export class MemStorage implements IStorage {
  private recipes: Map<number, Recipe>;
  private currentId: number;

  constructor() {
    this.recipes = new Map();
    this.currentId = 1;
  }

  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = this.currentId++;
    const recipe: Recipe = { ...insertRecipe, id };
    this.recipes.set(id, recipe);
    return recipe;
  }

  async updateRecipe(id: number, recipe: InsertRecipe): Promise<Recipe> {
    const updatedRecipe: Recipe = { ...recipe, id };
    this.recipes.set(id, updatedRecipe);
    return updatedRecipe;
  }

  async deleteRecipe(id: number): Promise<void> {
    this.recipes.delete(id);
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(recipe => 
      recipe.title.toLowerCase().includes(lowercaseQuery) ||
      recipe.ingredients.some(i => i.toLowerCase().includes(lowercaseQuery))
    );
  }
}

export const storage = new MemStorage();
