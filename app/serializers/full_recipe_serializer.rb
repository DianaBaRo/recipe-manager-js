class FullRecipeSerializer < ActiveModel::Serializer
  attributes :id, :name, :cooking_time, :servings, :directions, :userName

  has_many :recipe_ingredients, each_serializer: RecipeIngredientSerializer
  has_many :categories, each_serializer: CategorySerializer
  has_many :ratings, each_serializer: RatingSerializer
  has_many :comments, each_serializer: CommentSerializer

  def userName
    user = object.user
    user.name
  end
  
end
