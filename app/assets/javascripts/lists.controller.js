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
    ListsService.query(function(data){
      console.log('here\'s the lists data in the controller', data);
      vm.lists = data;
    });
  }
  
}
