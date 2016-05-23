angular
  .module('ListlyApp')
  .controller('ListController', ListController);

ListController.$inject = ['ListsService', 'ItemsService', '$location', '$routeParams'];
function ListController(   ListsService,   ItemsService,   $location,   $routeParams  ) {
  var vm = this;
  console.log('ListController is live');
  var listId = $routeParams.listId;
  vm.list = {};
  vm.items = [];

  vm.deleteItem = deleteItem;
  vm.toggleEditForm = toggleEditForm;
  vm.updateItem = updateItem;
  vm.createItem = createItem;

  getList(listId);

  // getting localhost:3000/api/lists/:id NOT localhost:3000/api/lists/:id/items
  // the first includes items and list info (like it's name)
  // the second includes only items
  function getList(id) {
    ListsService.get({id: id}, function(data) {
      console.log('query result:', data);
      vm.list = data;
      vm.items = data.items;
    });
  }

  function deleteItem(item) {
    console.log('deleting item: ', item);
    // list_id was included by the rails representation of this item
    // we can use that, or we have access to the listId from the $routeParams
    ItemsService.delete({ listId: item.list_id, itemId: item.id }, function(item) {
      console.log('deleted', item);
      vm.items.splice(vm.items.indexOf(item), 1);
    });
  }


  function toggleEditForm(item) {
    console.log('toggleEditForm for', item);
    // initially this property won't exist
    item.showForm = !item.showForm;
  }

  function updateItem(item) {
    console.log('update item', item);
    ItemsService.update({listId: item.list_id, itemId: item.id}, item, updateItemSuccess);

    function updateItemSuccess(receivedItem) {
      console.log('updateItemSuccess', receivedItem);
      // find the item in the array and replace it
      var index = vm.items.indexOf(item);
      vm.items[index] = receivedItem;
    }
  }

  function createItem() {
    var itemName = vm.newItemName;
    console.log('create with', itemName);
    if(vm.newItemName.length > 1) {
      ItemsService.save({listId: listId},
                       {name: itemName},
                       handleCreateItemSuccess);
      // blank out the box
      vm.newItemName = '';
    }
  }
  function handleCreateItemSuccess(item) {
    console.log('created', item);
    vm.items.unshift(item);
  }

}
