class FullRecipeSerializer < ActiveModel::Serializer
  attributes :id, :name, :cooking_time, :servings, :directions

  belongs_to :user, serializer: UserSerializer
  has_many :recipe_ingredients, each_serializer: RecipeIngredientSerializer
  has_many :ingredients, each_serializer: IngredientSerializer
  has_many :categories, each_serializer: CategorySerializer
  has_many :ratings, each_serializer: RatingSerializer
  has_many :comments, each_serializer: CommentSerializer
  
end
