class RecipeIngredientSerializer < ActiveModel::Serializer
  attributes :id, :quantity, :ingredientName

  def ingredientName
    ingredient = object.ingredient
    ingredient.name
  end

end
