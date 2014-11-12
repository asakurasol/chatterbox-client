// [TODO]: switch room(/join), befriend, sync
// room list(/list)
// $(document).ready(function(){
// =============== MODEL ==================
var Message = Backbone.Model.extend({
  idAttribute: "objectId",
  initialize: function() {
    var that = this;
    var mt = moment(that.get('createdAt')).format('HH:mm MM/DD/YYYY')
    that.set('msgtime', mt);


    // this.set('username', this.escape('username'));
    // this.set('text', this.escape('text'));
  },
  defaults: {
    'username': 'Ghost',
    'text': '',
    'roomname': 'lobby',
    'msgtime': ''
  },
  url: function() {
    return ChatSettings.APIURL;
  }
});

var User = Backbone.Model.extend({
  initialize: function() {},
  defaults: {
    'username': 'Ghost'
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
    return ChatSettings.APIURL;
  },
  initialize: function(models, options) {
    this.roomname = options.roomname;
  },
  parse: function(response) {
    return response.results;
  }
});

var UserFilters = Backbone.Collection.extend({
  model: User
})

// =============== VIEW ==================
var MessageView = Backbone.View.extend({
  tag: 'div',
  className: 'messageView ui small floating message',
  initialize: function() {},
  render: function() {
    var template = _.template($('#messageViewTemplate').html());
    this.$el.html(template(this.model.attributes));

    var $username = this.$el.find('.username');
    var usernameText = $username.text();
    console.log(this.checkFriend(usernameText));

    if ( this.checkFriend(usernameText) ) {
      $username.addClass('friendName');
    }

    // add filter click to username text
    this.$el.find('.username').click(function() {
      uF1.add([{
        username: usernameText
      }]);

      rv.$el.empty();
    });


    return this;
  },
  checkFriend: function(name) {
    return _(uF1.models).chain().map(function(now){
      return now.get('username')
    }).contains(name).value()
  }
});

var UserLabelView = Backbone.View.extend({
  tag: 'div',
  className: "ui label",
  initialize: function() {

  },
  render: function() {
    var template = _.template($('#userFilterTemplate').html());
    this.$el.html(template(this.model.attributes));
    this.$el.find('i').click(this.removeCallBack.bind(this));
    return this;
  },
  removeCallBack: function() {
    this.$el.html('');
    this.model.destroy();
    rv.$el.empty();
  }
})

var UserFiltersView = Backbone.View.extend({
  tag: 'div',
  initialize: function() {
    this.listenTo(this.collection, 'add', this.render);
    this.listenTo(this.collection, 'remove', this.render);
  },
  render: function() {
    var that = this;
    this._userFilters = [];
    this.collection.each(function(filter) {
      that._userFilters.push(new UserLabelView({
        model: filter
      }))
    });
    $(this.el).empty();
    _(this._userFilters).each(function(user) {
      $(that.el).append(user.render().el);
    })
  }
});



var RoomView = Backbone.View.extend({
  tag: 'div',
  className: 'messageContainer',
  initialize: function() {
    this.collection.on('sync', this.render, this);
  },
  render: function() {
    /*
    var that = this;
    this._messageViews = [];
    this.collection.each(function(msg) {
      that._messageViews.push(new MessageView({
        model: msg
      }));
    });

    $(this.el).empty(); // reset view

    _(this._messageViews).each(function(mv) { // mv: message view
      $(that.el).append(mv.render().el);
    });
    */
    // console.log(this.collection);


    d3.select(this.el).selectAll('div')
      .data(this.collection.models, function(d) {
        return d ? d.id : 'whatever';
      })
      .enter()
      .sort(function(a, b) {
        if (b.get('createdAt') > a.get('createdAt')) return 1;
        else return -1;
      })
      .insert(function(d) {
        var mv = new MessageView({
          model: d
        });
        return mv.render().el;
      }, ":first-child")
      .order();

  }

});

// =============== Posting/Commands ==================

var switchRoom = function(room_name) {
  if (typeof roomViews[room_name] === 'undefined') {

    roomViews[room_name] = new RoomView({
      collection: new Room([], {
        roomname: room_name
      })
    });

  }

  rv = roomViews[room_name];
  ChatSettings.roomname = room_name;
  $('#roomname').text(ChatSettings.roomname);


  $('#main-msg').empty();
  $('#main-msg').append(rv.el);
}

var sendMsg = function() {
  var text = $("#msgToSend").val();
  // check for commands
  // /join
  var join = /^\/join\s([a-zA-Z0-9]+)/.exec(text);
  if (join !== null) {
    switchRoom(join[1]);
  } else {
    // send message
    var msg = new Message();
    msg.set('username', ChatSettings.username);

    msg.set('text', text);
    msg.set('roomname', ChatSettings.roomname)
    msg.save();
  }

  $("#msgToSend").val('');
};

$("#sendMsgBtn").click(sendMsg);
$("#msgToSend").keydown(function(e) {
  if (e.keyCode == 13) {
    sendMsg();
  }
});

var bye = function(id) {
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox/' + id,
    type: 'DELETE',
    contentType: 'application/json',
    success: function(data) {
      console.log('data received:', data);
    },
    error: function(data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};
// });

var saver = function() {
  var list;
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {
      where: {
        username: 'BRETTSPENCER'
      },
      order: '-createdAt',
      limit: 5
    },
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent');
      list = data;
      list.results.forEach(function(p) {
        $.ajax({
          // always use this url
          url: 'https://api.parse.com/1/classes/chatterbox/' +
            p.objectId,
          type: 'DELETE',
          contentType: 'application/json',
          success: function(data) {
            console.log('chatterbox: Message sent', data);
          },
          error: function(data) {
            // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
            console.error(
              'chatterbox: Failed to send message');
          }
        });



      })
    },
    error: function(data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

}
