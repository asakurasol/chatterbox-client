// $(document).ready(function(){

  // =============== MODEL ==================
  var Message = Backbone.Model.extend({
    initialize: function() {
      this.fetch();
    },
    defaults: {
      'username': 'Ghost',
      'text': '',
      'roomname': 'lobby',
      'msgtime': ''
    },
    url: function() {
      return 'https://api.parse.com/1/classes/chatterbox/SFTwY4sW5G';
    }





  });

  // var message = {
  //   'username': 'shawndrost',
  //   'text': 'trololo',
  //   'roomname': '4chan'
  // };

  // =============== VIEW ==================
  var MessageView = Backbone.View.extend({
    tag: 'div',
    className: 'messageView',
    initialize: function() {
      //setInterval( this.render.call(this), 1000 );
      this.listenTo(this.model, 'change', this.render );
    },
    render: function() {
      var template = _.template($('#messageView').html());
      this.$el.html(template(this.model.attributes));
      return this;
    }




  });


  var m1 = new Message();
  var mv1 = new MessageView({model: new Message()});



// });


