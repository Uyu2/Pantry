import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Recipe } from "@shared/schema";
import { motion } from "framer-motion";

export default function RecipeView() {
  const { id } = useParams();
  const { data: recipe, isLoading } = useQuery<Recipe>({
    queryKey: [`/api/recipes/${id}`],
  });

  if (isLoading) return <div>Loading...</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-primary">{recipe.title}</h1>
            <div className="flex gap-4">
              <Link href={`/recipe/edit/${recipe.id}`}>
                <Button variant="outline">Edit</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">Back</Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
                <ul className="list-disc list-inside space-y-2">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
                <div className="prose">
                  {recipe.instructions.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {recipe.notes && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Notes</h2>
                <div className="prose">{recipe.notes}</div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
