class CommentsController < ApplicationController
  before_action :require_login
  
  def new
    if recipe
      @comment = @recipe.comments.build
    else
      @comment = Comment.new
    end
  end

  def create
    @comment = current_user.comments.build(comment_params)
    if @comment.save
      render json: @comment, status: 201
      #redirect_to recipe_path(@comment.recipe)
    else
      render :new
    end
  end

  def show
    @comment = Comment.find_by_id(params[:id])
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @comment }
    end
  end

  def index
    @users = User.all
    @recipes = Recipe.all

    if !params[:user].blank? #filtered by user
      @comments = Comment.by_user(params[:user])
    elsif !params[:recipe].blank? #filtered by recipe
      @comments = Comment.by_recipe(params[:recipe])
    elsif recipe #nested
      @comments = @recipe.comments
    else #it's not nested
      @comments = Comment.all
    end
    
  end

  private
  def comment_params
    params.require(:comment).permit(:recipe_id, :content)
  end

  def recipe
    @recipe = Recipe.find_by_id(params[:recipe_id])
  end

end