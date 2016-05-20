angular.module('ListlyApp')
  .service('ListsService', ListsService);

ListsService.$inject = ['$http', '$q'];
function ListsService($http, $q) {
  console.log('Lists service');
  var self = this;  // similar to vm = this, but we're not working with a view-model here so using the 'generic' form for this closure
  self.newList = {};  // we'll let get fill this in when it can
  self.lists = [];  // we'll let getAll fill this in when it can
  self.query = query;  // get all
  // self.get = get;     // get one
  // self.update = update;  // update
  // self.remove = remove;  // delete


  function query() {
    console.log('requesting lists');
    // create a new 'deferred'
    var def = $q.defer();
    // fire off the request
    $http({
      method: 'GET',
      url: '/api/lists'
    }).then(onListsIndexSuccess, onError);

    // we return the promise here - whenever it's complete any other .then's you attach will get run too
    return def.promise;

    // note how these functions are defined within the body of another function?
    // that gives them access to variables from that function
    // - see lexical scope & closures https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
    function onListsIndexSuccess(response){
      console.log('here\'s the get all response data from the service', response.data);
      self.lists = response.data;
      // ok, we got data, resolve the deferred - at this point we get to choose what we send on to the controller
      def.resolve(self.lists);
    }
    function onError(error){
      console.log('there was an error: ', error);
      self.lists.error = {error: error};
      // oh noes!  error - reject the deferred - at this point we get to choose what we send on to the controller
      def.reject(self.lists.error);
    }
  }
}
