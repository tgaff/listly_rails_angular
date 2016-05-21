angular
  .module('ListlyApp')
  .controller('ListsController', ListsController);

ListsController.$inject = ['ListsService', '$location'];
function ListsController(   ListsService,   $location    ) {
  var vm = this;
  console.log('ListsController is live');
  vm.lists = [];
  vm.newListName = '';
  vm.toggleEditForm = toggleEditForm;
  vm.deleteList = deleteList;
  vm.createList = createList;
  vm.showList = showList;
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

  function deleteList(list) {
    ListsService.remove({id: list.id}, handleDeleteSuccess);

      // declaring this inside deleteList to have a closure around list variable
      function handleDeleteSuccess(data) {
        console.log('deleted');
        vm.lists.splice(vm.lists.indexOf(list), 1);
      }
  }

  function createList() {
    console.log('create with', vm.newListName);
    if(vm.newListName.length > 1) {
      ListsService.save({name: vm.newListName}, handleCreateSuccess);
      vm.newListName = '';
    }
  }
  function handleCreateSuccess(data) {
    console.log('created', data);
    vm.lists.unshift(data);
  }

  function showList(list) {
    console.log('transition to showing list:', list);
    $location.path('/lists/' + list.id);
  }
}
