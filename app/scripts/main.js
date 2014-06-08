//  Model

// Defining a new model constructor with the name Todo
Todo = Backbone.Model.extend({

	// When a new instance is created initialize will run this function with whatever callback we decide to add in the future 
	initialize: function() {
		// When the model is updated do a thing
		this.on('change', function() {
			//  here is the future
		})
	},
	// Adding a default property of human and a value true
	defaults: {
		human: true
	},
	// Override the default of "id" since the database uses  "_id"
	idAttribute: '_id'
});

// Creating a new collection constructor called TodoCollection
TodoCollection = Backbone.Collection.extend({
	// Referencing the Todo Model
	model: Todo,
	// attached to this api
	url: 'http://tiny-pizza-server.herokuapp.com/collections/todo-drew',
})

// Defining a new view constructor - TodoView
TodoView = Backbone.View.extend({

	// Linking to the templates in our HTML doc
	template: _.template($('.todo-list-item').text()),
	editTemplate: _.template($('.todo-list-edit-item').text()),

	//  Defining events and listing the functions they run. 'click' alone will 
	//  fire on this.el and any of its contents. All of these only apply to the
	//  contents of this.el.
	events: {
		'click .edit-button': 'showEdit',
		'click .save-button': 'saveChanges',
		'click .delete-button': 'destroy',
		'keydown input': 'checkForChanges'
	},

	initialize: function() {

		// When a new instance of this view is created it will listen to changes to the model it's calling,
		// And render changes to the container we've designated in html
		this.listenTo(this.model, 'change', this.render);

		$('.container').append(this.el);
		this.render();
	},

	// pass current model attributes through the html method attached to this.$el
	render: function() {
		var renderedTemplate = this.template(this.model.attributes)
		this.$el.html(renderedTemplate);
	},

	// This does the same as above but renderes the edit template
	showEdit: function() {
		var renderedTemplate = this.editTemplate(this.model.attributes)
		this.$el.html(renderedTemplate);
	},

	// Store input value in a variable, set the name property on the model to the input value and save
	saveChanges: function() {
		var nameVal = this.$el.find('.todo input').val();
		this.model.set('todo', nameVal);
		this.model.save()
	},

	destroy: function() {
		// Destroy the current model instance
		this.model.destroy();
		// ... and this view as well
		this.remove();
	},

	// if the current model name does not match the input, add the .changed class
	// if current model matches the input remove the .changed class
	checkForChanges: function() {
		if (this.model.get('todo') !== this.$el.find('.todo input').val()) {
			this.$el.find('.todo input').addClass('changed')
		} else {
			this.$el.find('.todo input').removeClass('changed')
		}
	}


})

// when document is loaded and someone clicks the save-new button store the value, add to the collection and save
$(function() {
	$('.save-new').click(function() {
		var inputVal = $('.add-new-input').val()
		var newTodoInstance = newCollectionInstance.add({
			name: inputVal
		})

		newTodoInstance.save()

	})
})

// Create a new view contstructor, when an instance is created it will listen to the collection instance 
// and create a new TodoView instance, passing in the newly added todo model as the model arguement
AppView = Backbone.View.extend({

	initialize: function() {
		this.listenTo(newCollectionInstance, 'add', function(todo) {
			new TodoView({
				model: todo
			})
		})
	}

});

//  create instance of Todo Collection
var newCollectionInstance = new TodoCollection();

//  create instance of AppView
var app = new AppView();

// fetch the collection's models from the server
newCollectionInstance.fetch();