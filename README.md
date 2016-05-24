# Rails + Angular

In this activity we will build a Rails app with an angular front-end.  

## Options

There are a couple of ways to do this:

1. two separate apps
    1. Build an API in rails that serves only JSON
    2. Build a separate app in Angular and host it separately

 --  **OR** --
 
2. One app with /api routes and asset pipeline.
    
    Build an angular and rails app together and configure the rails app to use the asset pipeline and host the angular app.  Serve one route for the angular app and the rest of the routes will serve JSON that angular will consume.

We're going to be taking the second approach.  

## New tools

To help us use angular in rails we're going to use a few new tools.

##### Gem: `angular-rails-templates`

We'll use this to put our angular templates into the asset pipeline.  They will live inside `app/assets/templates`.

##### Gem: `angular_rails_csrf`

This handles setting a cookie in our angular app to work alongside Rails's _Cross-Site request forgery_ protection.  Without this our POST, PUT and DELETE requests would be rejected for security reasons.

## App description

* Our app is a TODO app.  
* It has **lists**.  
* **Lists** have many **items**.
* There are two main **front-end** pages/templates:
  * `/` or `/lists` which shows all the lists
  * `/lists/:id/` which lists all the list itmes and allows you to add/delete.
  * **Both of these are actually provided by the angular router, not Rails**  The Rails app only serves JSON + one HTML page.
* All of our /api routes on the backend are RESTful.  

Our routes on the backend look like:

```
      root GET    /                                       site#angular
list_items GET    /api/lists/:list_id/items(.:format)     items#index {:format=>:json}
           POST   /api/lists/:list_id/items(.:format)     items#create {:format=>:json}
 list_item GET    /api/lists/:list_id/items/:id(.:format) items#show {:format=>:json}
           PATCH  /api/lists/:list_id/items/:id(.:format) items#update {:format=>:json}
           PUT    /api/lists/:list_id/items/:id(.:format) items#update {:format=>:json}
           DELETE /api/lists/:list_id/items/:id(.:format) items#destroy {:format=>:json}
     lists GET    /api/lists(.:format)                    lists#index {:format=>:json}
           POST   /api/lists(.:format)                    lists#create {:format=>:json}
      list GET    /api/lists/:id(.:format)                lists#show {:format=>:json}
           PATCH  /api/lists/:id(.:format)                lists#update {:format=>:json}
           PUT    /api/lists/:id(.:format)                lists#update {:format=>:json}
           DELETE /api/lists/:id(.:format)                lists#destroy {:format=>:json}
           GET    /*path(.:format)                        site#angular
```

* Notice the `/` route and the `/*path` route - these serve the same HTML all the time.  This is how we'll load angular.


## Getting started - Rails side


1. Create a new Rails application with a Postgres database and _no javascript_:

 ```bash
    rails new listly --skip-javascript --database=postgresql -T 	cd listly
 	rake db:create
 ```
 
  > We disabled javascript.  This way the app won't have turbolinks or jquery.  We'll add angular in just a bit.

2. Go [setup bootstrap](https://github.com/twbs/bootstrap-sass).  You can _skip_ setting up bootstrap's javascript.

3. Create a `SiteController` with an `angular` action. You'll also need to create `site/angular.html.erb` inside `app/views`. Your `site#angular` will serve as the "layout" for your Angular app.

#### Server Routes

1. Since `site#angular` is the "layout" for your Angular app, you want the server to respond with this view every time a route is requested. This will allow Angular to handle routing on the client-side.

You can use `get '*path'` to send every server-requested route to `site#index`:

 ```ruby
 #
 # config/routes.rb
 #

 Rails.application.routes.draw do
   root 'site#angular'
   
   get '*path', to: 'site#angular'
 end
 ```


#### Requiring Angular

1. As you've seen before, there are many ways to require assets in Rails. In this case let's use the asset pipeline.  Download angular into vendor/assets.  

  ```sh
  $ curl https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular.js > vendor/assets/javascripts/angular.js
  $ curl https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular-route.js > vendor/assets/javascripts/angular-route.js
  ```
  
1. Previously we disabled javascript, so we need to re-enable that.  In your application layout add the `javascript_include_tag`.

	```html
	<!-- application.html.erb -->
	<!DOCTYPE html>
	<html>
	<head>
	  <title>Listly</title>
	  <%= stylesheet_link_tag    'application', media: 'all' %>
	  <%= javascript_include_tag 'application' %>
	  <%= csrf_meta_tags %>
	</head>
	<body>
	
	<%= yield %>
	
	</body>
	</html>
	```

1. Now in `/app/assets/javascripts/application.js` add the following: (you may need to create the file).
	
	```js
	/*
	* app/assets/javascripts/application.js
	*/

	//= require angular
	//= require angular-route

	//= require_tree .
	
	
	console.log('application.js loaded');
	```

1. Test your root route and make sure that you see the console.log message!

#### Configuring Your Angular App

1. Create a new JavaScript file `app/assets/javascripts/listly.module.js`. This is where you'll put the initial logic for your Angular app.
  * Once you get more than one controller, you should break this up into files like `wine.controller.js`, `wine.service.js`, `painters.controller.js`.

2. Make sure to require your newly created `listly.module.js` in `application.js` after angular:
	
	```js
	/*
	* app/assets/javascripts/application.js
	*/
		
	//= require angular
	//= require angular-route
	//
	//= require listly.module
	//= require_tree .
	```

3. Add the `ng-app` directive in the `<html>` tag in the application layout:
	
	```html
	<!-- app/views/layouts/application.html.erb -->

	<!DOCTYPE html>
	<html ng-app="ListlyApp">
	<head>
	  <title>Listly</title>
	  <%= stylesheet_link_tag    'application', media: 'all' %>
	  <%= javascript_include_tag 'application' %>
	  <%= csrf_meta_tags %>
	</head>
	<body>
	
	<%= yield %>
	
	</body>
	</html>
	```

4. We're using **ngRoute** so add the required `ng-view` tag to the [angular view](/app/views/site/angular.html.erb).
    
    ```html
      <!-- app/views/site/angular.html.erb -->
      
      <div ng-view></div>
    ```

5. Configure your Angular app in `listly.module.js`:

  ```js
  /*
  * app/assets/javascripts/listly.module.js
  */

  angular.module('ListlyApp', ['ngRoute']);
  ```


#### Adding Templates

1. You can use the <a href="https://github.com/pitr/angular-rails-templates" target="_blank">angular-rails-templates</a> gem to add your Angular templates to the Rails asset pipeline.

 Require the gem in your `Gemfile`:

  ```ruby
  #
  # Gemfile
  #

  gem 'angular-rails-templates'
  ```

2. Require `angular-rails-templates` in `application.js`, as well as the path to your Angular templates (which you'll create in the next step):

	```js
	/*
	* app/assets/javascripts/application.js
	*/
	
	//= require angular
	//= require angular-route
	//
	//= require angular-rails-templates
	// Templates in app/assets/templates
	//= require_tree ../templates
	//= require listly.module
	//= require_tree .
	
	
	console.log('application.js loaded');
	```

 **Note:** Make sure you require your templates AFTER your Angular files and BEFORE `listly.module.js`.

3. Make a `templates` directory inside `app/assets`, and create a template:

 ```
 ➜  mkdir app/assets/templates
 ➜  touch app/assets/templates/lists.template.html
 ```

 At this point, you should `bundle install` and restart your Rails server if you haven't already.

4. Add the `templates` module to your Angular app's dependencies in `listly.module.js`:

 ```js
 /*
  * app/assets/javascripts/listly.module.js
  */

 angular.module('sampleApp', ['ngRoute', 'templates']);
 ```

> Note at this stage, you haven't added anything to display your template.  Its content will NOT be displayed yet.
  
#### Configuring Angular Routes

1. Configure your Angular routes in `app.js` to hook everything up:
	
	```js
	angular.module('ListlyApp', ['ngRoute', 'templates'])
	  .config(config);
	
	config.$inject = ['$routeProvider', '$locationProvider'];
	function config (  $routeProvider,   $locationProvider  )  {
	  $routeProvider
	    .when('/', {
	      templateUrl: 'lists.template.html',
	      controller: 'ListsController',
	      controllerAs: 'listsCtrl'
	    })
	    .otherwise({
	      redirectTo: '/'
	    });
	
	
	  $locationProvider
	    .html5Mode({
	      enabled: true,
	      requireBase: false
	    });
	}
	```
	
2. Create and configure a controller with some test data, so you can check to see if the route, template, and controller are properly connected:

```js
/*
* app/assets/javascripts/lists.controller.js
*/

angular
  .module('ListlyApp')
  .controller('ListsController', ListsController);

ListsController.$inject = ['$location'];
function ListsController(   $location  ) {
  var vm = this;
  console.log('ListsController is live');
  vm.lists = [{ id: 1, name: 'homework list'}, { id: 300, name: 'shopping'}];
  vm.sampleData = 'hello world';
```

3. On your own, add a little content to your template to test the controller and router.  Test it and make sure content from your ListsController is rendered before continuing.

  > hint: try to get the sampleData above onto the page.
  > If you see javascript errors, resolve them before proceeding.

#### Rails CRUD

Now that your Angular app is all set up, it's time to CRUD a resource! You'll need:

1. Create the basic API routes for the **`lists`** and **`items`** resources.  
  * Use `scope` here to put your routes under `/api/`
  * set the /api routes format to always use JSON.  `defaults: { format: :json }`
  * Use resources for restful routes...
     * ..but we don't need `new` or `edit` pages since we won't be serving HTML and therefore have no need of forms for our users to fill in.

    ```ruby
    #
    # config/routes.rb
    #
    	
    # api/ urls and default to json
    scope '/api', defaults: { format: :json } do
      # since we're just doing a json api we don't need new and edit pages to hold forms for our users
      resources :lists, except: [:new, :edit] do
        resources :items, except: [:new, :edit]
      end
    end
    ```

1. **OPTIONAL**: If you don't want to have to remove the html.erb and assets (js/css) files each time you `rails generate` you can:
  <details><summary>disable asset and html.erb generation</summary>
      
    ```rb
    # 
    # config/application.rb
    #
      
    # prevent scaffold from generating html.erb view templates, assets
    config.generators do |g|
      g.template_engine nil
      g.assets false
    end
    
    ```
    If you're uncertain where to put this check out the [example](config/application.rb)
  
  </details>

1. Generate the lists controller.  In the interest of saving time, please [use the code provided for you](app/controllers/lists_controller.rb).  Make sure you read over it.  Things to take note of:
  * the controller is designed with only JSON in mind

1. Use the rails console or the [provided seeds.rb](db/seeds.rb) to get some data into the database.  Manually visit **and test** the `/api/lists` route.

#### Angular setup

1. An angular [controller](app/assets/javascripts/lists.controller.js) is provided for you, go ahead and drop it into `app/assets/javascripts/lists.controller.js`. 

1. Do the same thing with the [service](app/assets/javascripts/lists.service.js) that we'll use to communicate with the API.  Put this in `app/assets/javascripts/lists.controller.js`.
  
  You might take a look at the code here; since we're using RESTful routes we can make use of ngResource.  Instead of writing all the AJAX code ourselves using $http; we can use the pre-build ngResource.

1. We need to install ngResource first.  Use curl to store it in `vendor/assets`.  

    ```sh
    curl https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular-resource.js  > vendor/assets/angular-resource.js
    ```

Make sure you also add it to [`app/assets/javascripts/application.js`](app/assets/javascripts/application.js)

1. Finally grab the [provided template](app/assets/templates/lists.template.html) and replace the source of your current template with this.  