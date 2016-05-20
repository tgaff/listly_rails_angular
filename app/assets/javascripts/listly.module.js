angular.module('ListlyApp', ['ngRoute'])
  .controller('TestController', TestController);

TestController.$inject = [];
function TestController() {
  console.log('test controller is working');
  this.test = 'hello world';
}
