class RatingSerializer < ActiveModel::Serializer
  attributes :id, :score, :ratingUser

  def ratingUser
    user = object.user
    user.name
  end
end
