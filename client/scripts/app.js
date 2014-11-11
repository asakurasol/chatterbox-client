// [TODO]: handlebar, post messages, hack other people
// auto-refresh, switch room

// $(document).ready(function(){

  // =============== MODEL ==================
  var Message = Backbone.Model.extend({
    initialize: function() {
      var that = this;

      var mt = moment( that.get('createdAt') ).format('HH:mm MM/DD/YYYY')
      that.set('msgtime', mt );

      this.set('username', this.escape('username'));
      this.set('text', this.escape('text'));
    },
    defaults: {
      'username': 'Ghost',
      'text': '',
      'roomname': 'lobby',
      'msgtime': ''
    },
    url: function() {
      return 'https://api.parse.com/1/classes/chatterbox';
    }





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
      return 'https://api.parse.com/1/classes/chatterbox?where={"roomname":"'+this.roomname+'"}&order=-createdAt';
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

  var room = new Room([], {roomname:'lobby'});
  var rv = new RoomView( {collection: room } );
  var renderAll = function() {
    room.fetch({
      reset: true,
      success: function() {
        rv.render();
        $('#main-msg').empty();
        $('#main-msg').append(rv.el);
      }
    });
  };

  renderAll();
  window.setInterval(renderAll, 5000);


// =============== Posting ==================



// });


