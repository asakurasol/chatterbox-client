// $(document).ready(function(){

  // =============== MODEL ==================
  var Message = Backbone.Model.extend({
    initialize: function() {
      var that = this;
      // this.fetch({success:function() {
      //   }
      // });

    var mt = moment( that.get('createdAt') ).format('HH:mm MM/DD/YYYY')
    that.set('msgtime', mt );

    },
    defaults: {
      'username': 'Ghost',
      'text': '',
      'roomname': 'lobby',
      'msgtime': ''
    },
    // url: function() {
    //   return 'https://api.parse.com/1/classes/chatterbox/SFTwY4sW5G';
    // }





  });

  // var message = {
  //   'username': 'shawndrost',
  //   'text': 'trololo',
  //   'roomname': '4chan'
  // };

  // =============== COLLECTION(Room) ==================
  var Room = Backbone.Collection.extend({
    model: Message,
    url: function() {
      return 'https://api.parse.com/1/classes/chatterbox?where={"roomname":"'+this.roomname+'"}';
    },
    initialize: function(models, options) {
      this.roomname = options.roomname;
      this.fetch();
    },
    parse: function(response) {
      return response.results;
    }
  });



  // =============== VIEW ==================
  var MessageView = Backbone.View.extend({
    tag: 'div',
    className: 'messageView ui floating message',
    initialize: function() {
      //setInterval( this.render.call(this), 1000 );
      this.listenTo(this.model, 'change', this.render );
    },
    render: function() {
      var template = _.template($('#messageViewTemplate').html());
      this.$el.html(template(this.model.attributes));
      return this;
    }

  });

  var RoomView = Backbone.View.extend({
    tag: 'div',
    className: 'messageContainer',
    initialize: function() {
      var that = this;
    },
    render: function() {
      var that = this;

      this._messageViews = [];
      this.collection.each(function(msg) {
        that._messageViews.push(new MessageView({
          model: msg
        }));
      });
      $(this.el).empty(); // reset view

      _(this._messageViews).each(function(mv){ // mv: message view
        $(that.el).append(mv.render().el);
      });
    }

  });


  var rv = new RoomView( {collection: new Room([],{roomname:'lobby'}) } );



// });


