$(() => {
  NewCommentSubmission();
  NewNestedCommentSubmission();
  RecipesOnClick();
});

const RecipesOnClick = () => {
  //Event delegation
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
      //Use constructor function to create clinic objects
      let newRecipe = new Recipe(recipe);
      newRecipe.formatIndex();
    });
  });    
};
  
const NewCommentSubmission = () => {
  $(document).on('submit', "#new-comment", function(event) {
    //prevent form from submitting the default way
    event.preventDefault();
    var values = $(this).serialize();
    var posting = $.post(`/comments`, values);
    posting.done(function(data) {
      $('#commentResult').html('');
      const newComment = new Comment(data);
      newComment.formatComment();
    });
  });
};

const NewNestedCommentSubmission = () => {
  $(document).on('submit', '#new-nested-comment', function(event) {
    //prevent form from submitting the default way
    event.preventDefault();
    var values = $(this).serialize();
    let recipeId = $('.recipeId').data('recipe-id');
    var posting = $.post(`/recipes/${recipeId}/comments`, values);
    posting.done(function(data) {
      $('#commentResult').html('');
      const newComment = new Comment(data);
      newComment.formatComment();
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
    this.user_id = data.user_id;
  };
  
  //Prototype function (similar to instance methods) to format comment
  formatIndex() {
    let html = "";
    html +=
    `
    <ul class="list-group list-group-flush" id="recipes-index">
      <a href="/recipes/${this.id}" class="list-group-item"><strong>${this.name}</strong></a>
    </ul>
    `;
    $("#recipe-index").append(html);
  };
};
  
class Comment {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.recipe_id = data.recipe_id;
    this.content = data.content;
    this.userName = data.user.name;
  };
  
  //Prototype function (similar to instance methods) to format comment
  formatComment() {
    let html = "";
    html +=
    `
    <div class="container text-center">
      <h4>Comment created succesfully</h4><br />
      <p>${this.content}</p><br />
      <p><strong>Posted by ${this.userName}</strong></p>
    </div>
    `;
    $("#commentResult").append(html);
  };
};