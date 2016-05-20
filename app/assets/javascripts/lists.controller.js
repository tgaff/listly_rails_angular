angular
  .module('ListlyApp')
  .controller('ListsController', ListsController);

ListsController.$inject = ['ListsService'];
function ListsController(   ListsService    ) {
  var vm = this;
  console.log('ListsController is live');
  vm.lists = [];
  vm.toggleEditForm = toggleEditForm;

  // fetch data
  getLists();

  function toggleEditForm(list) {
    list.showForm = !list.showForm;
  }

  function getLists() {
    ListsService.query().then(function(data){
      console.log('here\'s the books data in the controller', data);
      vm.lists = data;
    });
  }
}
