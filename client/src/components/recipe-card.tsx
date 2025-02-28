import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { type Recipe, recipeTags, tagColors } from "@shared/schema";
import RecipeIcon from "./recipe-icon";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const statusTag = recipe.tags.find(tag => recipeTags.status.includes(tag as any));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/recipe/${recipe.id}`}>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-white/95">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-xl text-primary">{recipe.title}</CardTitle>
              <div className="flex gap-2 flex-wrap justify-end">
                <Badge variant={recipe.type === "pie" ? "default" : "secondary"} className="bg-primary/90">
                  {recipe.type}
                </Badge>
                {statusTag && (
                  <Badge
                    variant="outline"
                    className={`${tagColors[statusTag].bg} ${tagColors[statusTag].text} border-transparent`}
                  >
                    {statusTag}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 w-32 mx-auto">
              <RecipeIcon 
                type={recipe.type as "pie" | "crust"}
                imageType={recipe.imageType}
                className="w-full h-full"
              />
            </div>
            <p className="text-sm text-primary/80">
              {recipe.ingredients.length} ingredients
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}