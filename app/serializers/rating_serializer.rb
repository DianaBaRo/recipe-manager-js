class RatingSerializer < ActiveModel::Serializer
  attributes :id, :score

  belongs_to :user, serializer: UserSerializer
end
