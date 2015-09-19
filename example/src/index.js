import ExampleDirective from './ExampleDirective';
import ExampleController from './ExampleController';
import ExampleService from './ExampleService';

angular
  .module('example', [])
  .controller('ExampleController', ExampleController)
  .directive('exDirective', ExampleDirective)
  .service('$exService', ExampleService);
