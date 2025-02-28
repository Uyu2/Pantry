import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeCard from "@/components/recipe-card";
import { type Recipe } from "@shared/schema";
import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedFrog from "@/components/animated-frog";
import DragableClock from "@/components/draggable-clock";

export default function Home() {
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState("pies");
  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  const pies = filteredRecipes.filter(r => r.type === "pie");
  const crusts = filteredRecipes.filter(r => r.type === "crust");

  return (
    <div className="min-h-screen picnic-bg">
      {/* Clock is only visible when clock tab is active */}
      <DragableClock isVisible={currentTab === "clock"} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-4"
          >
            <AnimatedFrog />
            <h1 className="text-4xl font-bold text-primary">Froggy's Pies</h1>
          </motion.div>
          <Link href="/recipe/new">
            <Button className="bg-white text-primary hover:bg-white/90">New Recipe</Button>
          </Link>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-md bg-white/95 shadow-lg"
          />
        </div>

        <Tabs defaultValue="pies" className="space-y-4" onValueChange={setCurrentTab}>
          <TabsList className="bg-white/95 shadow-lg">
            <TabsTrigger value="pies">Pies</TabsTrigger>
            <TabsTrigger value="crusts">Crusts</TabsTrigger>
            <TabsTrigger value="clock">Clock</TabsTrigger>
          </TabsList>

          <TabsContent value="pies" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 bg-white/95 rounded-lg">Loading your delicious pies...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pies.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="crusts" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 bg-white/95 rounded-lg">Loading your crusty creations...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crusts.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="clock" className="space-y-4">
            <div className="text-center py-8 bg-white/95 rounded-lg">
              The timer window is always available! You can drag it anywhere on the screen.
              The timer will continue running even when you switch between tabs.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}