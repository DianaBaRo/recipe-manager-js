class RecipeIngredientSerializer < ActiveModel::Serializer
  attributes :id, :quantity, :ingredientName

  #With this method I don't need the ingredient serializer
  def ingredientName
    ingredient = object.ingredient
    ingredient.name
  end

end
