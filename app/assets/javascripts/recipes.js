//Document ready function with arrow syntax of ES6
$(() => {
  RecipesOnClick();
  RecipeOnClick();
  SortedRecipes();
});

const SortedRecipes = () => {
  $(document).on('click', "#sorted-recipes", function(e) {
    e.preventDefault();
    fetch(`/recipes.json`)
    .then(response => response.json())
    .then(recipes => {
      recipes.sort(function(a, b) {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      $("#recipe-index").html('');
      recipes.forEach(recipe => {
        let newRecipe = new Recipe(recipe);
        newRecipe.formatIndex();
      });
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
    $("#recipe-index").html('');
    recipes.forEach(recipe => {
      //Use constructor function to create recipe objects
      let newRecipe = new Recipe(recipe);
      newRecipe.formatIndex();
    });
  });    
};

const emptyArray = (array) => {
  if (array === undefined || array.length == 0) {
    return true;
  } else {
    return false;
  };
};

const RecipeOnClick = () => {
  $(document).on('click', '.show-recipe', function(e) {
    e.preventDefault();
    let id = $(this).attr('data-id');
    let url = 'http://localhost:3000/recipes/' + id;
    history.pushState(null, null, url);
    fetch(`${id}.json`)
    .then(response => response.json())
    .then(recipe => {
      let newRecipe = new Recipe(recipe);
      newRecipe.formatShow();

      const recipeComments = recipe.comments;
      if (emptyArray(recipeComments)) {
        $(".show-comments").remove();
      } else {
        recipeComments.forEach(comment => {
          showComments(comment);
        });
      };
    
      const recipeIngredients = recipe.recipe_ingredients;
      if (emptyArray(recipeIngredients)) {
        $(".show-ingredients").remove();
      } else {
        recipeIngredients.forEach(ri => {
          showIngredients(ri);
        });
      };

      const recipeRatings = recipe.ratings;
      if (emptyArray(recipeRatings)) {
        $(".show-ratings").remove();
      } else {
        recipeRatings.forEach(rating => {
          showRatings(rating);
        });
      };

      const recipeCategories = recipe.categories;
      if (emptyArray(recipeCategories)) {
        $(".show-categories").remove();
      } else {
        recipeCategories.forEach(category => {
          showCategories(category);
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
    $("#links-to-indexes").html('');
    $("#recipe-index").html('');
    $("#recipe-show").html(html);
  };
};
  
function showComments(comment) {
  let html = "";
  html +=
  `
  <p>${comment.content}
  <strong>Posted by ${comment.commentUser}</strong><br /></p>
  `;
  $(".show-comments").append(html);
};

function showIngredients(ingredient) {
  let html = "";
  html +=
  `
  ${ingredient.ingredientName} (${ingredient.quantity}) 
  `;
  $(".show-ingredients").append(html);
};

function showRatings(rating) {
  let html = "";
  html +=
  `
  <p>${rating.score} star - <strong> ${rating.ratingUser}</strong><br /></p>
  `;
  $(".show-ratings").append(html);
};

function showCategories(category) {
  let html = "";
  html +=
  `
  ${category.name}
  `;
  $(".show-categories").append(html);
};