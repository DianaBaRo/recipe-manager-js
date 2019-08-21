$(() => {
  NewCommentSubmission();
});

const NewCommentSubmission = () => {
   
    $('#new-comment').on("submit", function(event) {
      //prevent form from submitting the default way
      event.preventDefault();
 
      var values = $(this).serialize();
      var posting = $.post(`/comments`, values);
      posting.done(function(data) {
        const newComment = new Comment(data);
        newComment.formatComment();
      });
    });
  };


//JavaScript Model Object using ES6 class


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