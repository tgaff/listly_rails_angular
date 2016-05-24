angular.module('ListlyApp')
  .service('ListsService', ListsService);

  ListsService.$inject = ['$resource'];
  function ListsService($resource) {

    /* ngResource <3 RESTful routes
    { 'get':    'GET /items/:id',
      'save':   'POST /items',
      'query':  'GET /items',
      'remove': 'DELETE /items/:id',
      'update': 'PUT /items/:id' };
    */
    resource = $resource('/api/lists/:id', {id: '@id'},{
        update: {
          method: 'PUT' // this method issues a PUT request
        },
        query: {
          isArray: true,
        }
      });
    return resource;
  }
