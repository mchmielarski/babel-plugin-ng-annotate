
class ExampleDirective {

  restrict      = 'E';
  controller    = 'ExampleController';
  controllerAs  = '$exCtrl';
  template      = `
    <button ng-click="$exCtrl.load()">load data</button>
    {{$exCtrl.data}}
  `;

}

export default ExampleDirective;
