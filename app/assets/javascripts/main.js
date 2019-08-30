//Document ready function with arrow syntax of ES6
$(() => {
  NewCommentSubmission();
  NewNestedCommentSubmission();
  RecipesOnClick();
  RecipeOnClick();
});

const NewCommentSubmission = () => {
  //Event delegation
  $(document).on('submit', "#new-comment", function(event) {
    //prevent form from submitting the default way
    event.preventDefault();
    const values = $(this).serialize();
    const posting = $.post(`/comments`, values);
    posting.done(function(data) {
      $('#commentResult').html('');
      //Creating a new comment object in JS
      const newComment = new Comment(data);
      newComment.formatComment();
    });
    posting.fail(function(jqXHR, textStatus, errorThrown) {
      //console.log(jqXHR["responseText"])
      const message = "*There was an error. Please, select a recipe and add some content to succesfully create a comment.";
      $("#commentResult").append(message);
    });
  });
};
  
const NewNestedCommentSubmission = () => {
  $(document).on('submit', '#new-nested-comment', function(event) {
    //prevent form from submitting the default way
    event.preventDefault();
    const values = $(this).serialize();
    
    //let recipeId = $(this.recipe).attr('data-recipe_id');
    let recipeId = $('.recipeId').data('recipe-id');
    const posting = $.post(`/recipes/${recipeId}/comments`, values);
    posting.done(function(data) {
      $('#commentResult').html('');
      const newComment = new Comment(data);
      newComment.formatComment();
    });
    posting.fail(function() {
      const message = "*There was an error. Please, add some content to succesfully create a comment";
      $("#commentResult").append(message);
    });
  });
};

const RecipesOnClick = () => {
  $(document).on('click', "#all-recipes", function(e) {
    e.preventDefault();
    let url = 'http://localhost:3000/recipes';
    history.pushState(null, null, url);
    getRecipes();
  });
};
    
const getRecipes = () => {
  fetch(`/recipes.json`)
  .then(response => response.json())
  .then(recipes => {
    recipes.forEach(recipe => {
      //Use constructor function to create recipe objects
      let newRecipe = new Recipe(recipe);
      newRecipe.formatIndex();
    });
  });    
};

const RecipeOnClick = () => {
  $(document).on('click', '.show-recipe', function(e) {
    e.preventDefault();
    let id = $(this).attr('data-id');
    let url = 'http://localhost:3000/recipes/' + id;
    history.pushState(null, null, url)
    fetch(`${id}.json`)
    .then(response => response.json())
    .then(recipe => {
      let newRecipe = new Recipe(recipe);
      newRecipe.formatShow();

      const recipeComments = recipe.comments;
      if (recipeComments === undefined || recipeComments.length == 0) {
        $(".show-comments").remove();
      } else {
        recipeComments.forEach(comment => {
          let newComment = new Comment(comment);
          newComment.showComments();
        });
      };
      
      const recipeIngredients = recipe.recipe_ingredients;
      if (recipeIngredients === undefined || recipeIngredients.length == 0) {
        $(".show-ingredients").remove();
      } else {
        recipeIngredients.forEach(ri => {
          let newRecipeIngredient = new RecipeIngredient(ri);
          newRecipeIngredient.showIngredients();
        });
      };

      const recipeRatings = recipe.ratings;
      if (recipeRatings === undefined || recipeRatings.length == 0) {
        $(".show-ratings").remove();
      } else {
        recipeRatings.forEach(rating => {
          let newRating = new Rating(rating);
          newRating.showRatings();
        });
      };

      const recipeCategories = recipe.categories;
      if (recipeCategories === undefined || recipeCategories.length == 0) {
        $(".show-categories").remove();
      } else {
        recipeCategories.forEach(category => {
          let newCategory = new Category(category);
          newCategory.showCategories();
        });
      };
    });
  });
};

//JavaScript Model Object using ES6 class
  
class Recipe {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.cooking_time = data.cooking_time;
    this.servings = data.servings;
    this.directions = data.directions;
    this.userName = data.userName
  };
  
  //Prototype function (similar to instance methods) to format comment
  formatIndex() {
    let html = "";
    html +=
    `
    <ul class="list-group list-group-flush">
      <a href="/recipes/${this.id}" data-id="${this.id}" class="list-group-item show-recipe"><strong>${this.name}</strong></a>
    </ul>
    `;
    $("#recipe-index").append(html);
  };

  formatShow() {
    let html = "";
    //Template literal (Template string)
    html +=
    `
    <div class="container text-center">
      <h1>${this.name}</h1>
      <br />
    </div>
    <div class="container">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Cooking time in minutes: ${this.cooking_time}</li>
        <li class="list-group-item">Servings: ${this.servings}</li>
        <li class="list-group-item">Directions: ${this.directions}</li>
        <li class="list-group-item show-ingredients">Ingredients:</li>
        <li class="list-group-item show-categories">Categories:</li>
        <li class="list-group-item"><strong>Recipe created by ${this.userName}</strong></li>
      </ul>
    </div>
    <br /><br />
    <div class="show-ratings">
      <h6>Ratings:</h6><br />
    </div>
    <br /><br />
    <div class="btn btn-primary">
      <a href="/recipes/${this.id}/comments/new" class="btn text-white">Comment recipe</a>
    </div>
    <br /><br />
    <div class="show-comments">
      <h6>Comments:</h6><br />
    </div>
    `;
    $("#recipe-index").html('');
    $("#recipe-show").html(html);
  };
};
  
class Comment {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.recipeId = data.recipeId;
    this.content = data.content;
    this.commentUser = data.commentUser;
  };
  
  formatComment() {
    let html = "";
    html +=
    `
    <div class="container text-center">
      <h4>Comment created succesfully</h4><br />
      <p>${this.content}</p><br />
      <p><strong>Posted by ${this.commentUser}</strong></p>
      <p><a href="/recipes/${this.recipeId}">[ Back to recipe ]</a></p
    </div>
    `;
    $("#commentResult").append(html);
  };

  showComments() {
    let html = "";
    html +=
    `
    <p>${this.content}
    <strong>Posted by ${this.commentUser}</strong><br /></p>
    `;
    $("#recipe-index").html('');
    $(".show-comments").append(html);
  };
};

class RecipeIngredient {
  constructor(data) {
    this.id = data.id;
    this.quantity = data.quantity;
    this.ingredientName = data.ingredientName
  };
  
  showIngredients() {
    let html = "";
    html +=
    `
    ${this.ingredientName} (${this.quantity}) 
    `;
    $("#recipe-index").html('');
    $(".show-ingredients").append(html);
  };
};

class Rating {
  constructor(data) {
    this.id = data.id;
    this.score = data.score;
    this.ratingUser = data.ratingUser
  };
  
  showRatings() {
    let html = "";
    html +=
    `
    <p>${this.score} star - <strong> ${this.ratingUser}</strong><br /></p>
    `;
    $("#recipe-index").html('');
    $(".show-ratings").append(html);
  };
};

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
  };
    
  showCategories() {
    let html = "";
    html +=
    `
    ${this.name}
    `;
    $("#recipe-index").html('');
    $(".show-categories").append(html);
  };
};