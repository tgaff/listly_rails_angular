angular.module('ListlyApp', ['ngRoute', 'templates', 'ngResource'])
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
