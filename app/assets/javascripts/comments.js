//Document ready function with arrow syntax of ES6
$(() => {
  NewCommentSubmission();
  NewNestedCommentSubmission();
});

const NewCommentSubmission = () => {
  //Event delegation. #new-comment declared in comments controller
  $(document).on("submit", "#new-comment", function(event) {
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
  //#new-nested-comment declared in comments controller
  $(document).on('submit', '#new-nested-comment', function(event) {
    event.preventDefault();
    const values = $(this).serialize();
    
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

};