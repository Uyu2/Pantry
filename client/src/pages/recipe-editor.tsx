import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRecipeSchema, type Recipe, pieImages, crustImages, recipeTags, tagColors } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import RecipeIcon from "@/components/recipe-icon";
import { Alert } from "@/components/ui/alert";
import { Snowflake } from "lucide-react";

export default function RecipeEditor() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: recipe } = useQuery<Recipe>({
    queryKey: [`/api/recipes/${id}`],
    enabled: !!id,
  });

  // Fetch all crust recipes to use as tags
  const { data: crustRecipes = [] } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
    select: (recipes) => recipes.filter(r => r.type === "crust"),
  });

  const form = useForm({
    resolver: zodResolver(insertRecipeSchema),
    defaultValues: recipe || {
      title: "",
      type: "pie",
      ingredients: [],
      instructions: "",
      notes: "",
      imageType: "berry-red",
      tags: [],
      bakeTemp: 350,
      difficulty: "medium",
    },
  });

  const recipeType = form.watch("type");
  const bakeTemp = form.watch("bakeTemp");

  // Generate crust tags from existing crust recipes
  const crustTags = crustRecipes.map(crust => ({
    id: `${crust.id}-crust`,
    label: crust.title,
  }));

  const mutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      if (id) {
        return apiRequest("PUT", `/api/recipes/${id}`, data);
      }
      return apiRequest("POST", "/api/recipes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      toast({ title: "Success", description: "Recipe saved!" });
      setLocation("/");
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">
          {id ? "Edit Recipe" : "New Recipe"}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("imageType", value === "pie" ? "berry-red" : "classic");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pie">Pie</SelectItem>
                      <SelectItem value="crust">Crust</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bakeTemp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Baking Temperature</FormLabel>
                  <div className="flex gap-4 items-center">
                    <Select
                      onValueChange={(value) => field.onChange(value === "chilled" ? null : Number(value))}
                      value={field.value === null ? "chilled" : field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select temperature" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="chilled">
                          <span className="flex items-center gap-2">
                            <Snowflake className="w-4 h-4" />
                            Chilled
                          </span>
                        </SelectItem>
                        <SelectItem value="325">325°F</SelectItem>
                        <SelectItem value="350">350°F</SelectItem>
                        <SelectItem value="375">375°F</SelectItem>
                        <SelectItem value="400">400°F</SelectItem>
                        <SelectItem value="425">425°F</SelectItem>
                        <SelectItem value="450">450°F</SelectItem>
                        <SelectItem value="475">475°F</SelectItem>
                        <SelectItem value="500">500°F</SelectItem>
                      </SelectContent>
                    </Select>
                    {field.value === null && (
                      <Alert variant="info" className="flex-1">
                        This is a no-bake recipe that requires chilling
                      </Alert>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">
                        <span className={`px-2 py-1 rounded ${tagColors.easy.bg} ${tagColors.easy.text}`}>
                          Easy
                        </span>
                      </SelectItem>
                      <SelectItem value="medium">
                        <span className={`px-2 py-1 rounded ${tagColors.medium.bg} ${tagColors.medium.text}`}>
                          Medium
                        </span>
                      </SelectItem>
                      <SelectItem value="hard">
                        <span className={`px-2 py-1 rounded ${tagColors.hard.bg} ${tagColors.hard.text}`}>
                          Hard
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormDescription>
                    Select all that apply
                  </FormDescription>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {recipeType === "pie" && (
                      <>
                        {crustTags.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Crust Type</h4>
                            {crustTags.map((crust) => (
                              <div key={crust.id} className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                  checked={field.value.includes(crust.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, crust.id]);
                                    } else {
                                      field.onChange(field.value.filter((t) => t !== crust.id));
                                    }
                                  }}
                                />
                                <label className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                  {crust.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium mb-2">Filling Type</h4>
                          {recipeTags.filling.map((tag) => (
                            <div key={tag} className="flex items-center space-x-2 mb-2">
                              <Checkbox
                                checked={field.value.includes(tag)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, tag]);
                                  } else {
                                    field.onChange(field.value.filter((t) => t !== tag));
                                  }
                                }}
                              />
                              <label className={`text-sm ${tagColors[tag].text} ${tagColors[tag].bg} px-2 py-1 rounded`}>
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style</FormLabel>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {(recipeType === "pie" ? pieImages : crustImages).map((style) => (
                      <div
                        key={style}
                        className={`cursor-pointer p-2 rounded-lg border-2 ${
                          field.value === style ? "border-primary" : "border-transparent"
                        }`}
                        onClick={() => field.onChange(style)}
                      >
                        <RecipeIcon
                          type={recipeType}
                          imageType={style}
                          className="w-full aspect-square"
                        />
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value.join("\n")}
                      onChange={(e) => field.onChange(e.target.value.split("\n"))}
                      className="min-h-[200px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[200px]" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ""} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending}>
                Save Recipe
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}