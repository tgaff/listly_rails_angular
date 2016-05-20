angular.module('ListlyApp', ['ngRoute', 'templates'])
  .controller('ListsController', ListsController)
  .config(config);

config.$inject = ['$routeProvider', '$locationProvider'];
function config (  $routeProvider,   $locationProvider  )  {
  $routeProvider
    .when('/', {
      templateUrl: 'liststemplate.html',
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


function ListsController() {
  var vm = this;
  console.log('controller working');
  this.test = 'hello World';
}
