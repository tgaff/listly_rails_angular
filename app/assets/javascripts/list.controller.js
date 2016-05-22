angular
  .module('ListlyApp')
  .controller('ListController', ListController);

ListController.$inject = ['ListsService', '$location', '$routeParams'];
function ListController(   ListsService,   $location,   $routeParams  ) {
  var vm = this;
  console.log('ListController is live');
  var listId = $routeParams.listId;
  vm.list = {};
  vm.items = [];
//   vm.newItemName = '';
//
  getList(listId);

  function getList(id) {
    ListsService.get({id: id}, function(data) {
      console.log('query result:', data);
      vm.list = data;
      vm.items = data.items;
    });
  }
}
