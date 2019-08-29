class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :commentUser, :recipeId

  def commentUser
    user = object.user
    user.name
  end

  def recipeId
    recipe = object.recipe
    recipe.id
  end    

end

