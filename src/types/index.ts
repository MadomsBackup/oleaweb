export type Role = 'admin' | 'user';

export type UnitType = 'weight' | 'volume' | 'unit';

export interface CatalogItem {
  id: string;
  name: string;
  isEnabled: boolean;
}

export interface Measure extends CatalogItem {
  description?: string;
  abbreviation: string;
  unitType: UnitType;
  baseFactor: number;
}

export interface Category extends CatalogItem {
  description?: string;
}

export interface Ingredient extends CatalogItem {}

export interface Allergen extends CatalogItem {
  emoji: string;
}

export interface RecipePhoto {
  id?: string;
  base64Data: string;
  extension: string;
  sizeBytes: number;
  order?: number;
}

export interface RecipeIngredient {
  id?: string;
  ingredientId?: string;
  ingredient?: Ingredient;
  freeTextName?: string;
  quantity: number;
  measureId: string;
  measure?: Measure;
  allergenIds?: string[];
  allergens?: Allergen[];
  order?: number;
}

export interface PreparationStep {
  id?: string;
  content: string;
  timerSeconds?: number;
  order: number;
  referencedRecipeIngredientIds?: string[];
  referencedIngredients?: RecipeIngredient[];
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  category?: Category;
  ownerId: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings: number;
  videoUrl?: string;
  isFavorite: boolean;
  isEnabled: boolean;
  shareToken?: string;
  photos: RecipePhoto[];
  ingredients: RecipeIngredient[];
  steps: PreparationStep[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}
