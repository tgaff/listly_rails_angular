angular.module('ListlyApp')
  .service('ItemsService', ItemsService);

  ItemsService.$inject = ['$resource'];
  function ItemsService($resource) {

    /* ngResource <3 RESTful routes
    { 'get':    'GET /items/:id',
      'save':   'POST /items',
      'query':  'GET /items',
      'remove': 'DELETE /items/:id',
      'update': 'PUT /items/:id' };
    */
    resource = $resource('/api/lists/:listId/items/:itemId', {listId: '@listId', itemId: '@id'},{
        update: {
          method: 'PUT' // this method issues a PUT request
        },
        query: {
          isArray: true,
        }
      });
    return resource;
  }
