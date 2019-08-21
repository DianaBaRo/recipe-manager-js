class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content

  belongs_to :user, serializer: UserSerializer
  belongs_to :recipe, serializer: SimpleRecipeSerializer
end

