angular
  .module('ListlyApp')
  .controller('ListsController', ListsController);

ListsController.$inject = [];
function ListsController(      ) {
  var vm = this;
  console.log('ListsController is live');
  vm.lists = [{"id":1,"name":"hi","url":"http://localhost:3000/api/lists/1"},{"id":2,"name":"sample list","url":"http://localhost:3000/api/lists/2"},{"id":3,"name":"sample list","url":"http://localhost:3000/api/lists/3"},{"id":4,"name":"student list","url":"http://localhost:3000/api/lists/4"}];
  vm.toggleEditForm = toggleEditForm;

  function toggleEditForm(list) {
    list.showForm = !list.showForm;
  }
}
