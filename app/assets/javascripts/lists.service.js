angular.module('ListlyApp')
  .factory('ListsService', ListsService);

  ListsService.$inject = ['$http', '$q', '$resource'];
  function ListsService($http, $q, $resource) {

    /* ngResource <3 RESTful routes
    { 'get':    'GET /items/:id',
      'save':   'POST /items',
      'query':  'GET /items',
      'delete': 'DELETE /items/:id',
      'update': 'PUT /items/:id' };
    */
    resource = $resource('/api/lists/:id', {
        update: {
          method: 'PUT' // this method issues a PUT request
        },
        query: {
          isArray: true,
        }
      });
    return resource;
  }
