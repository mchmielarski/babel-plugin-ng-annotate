# babel-plugin-ng-annotate

## How to install

```
$ npm install --save-dev babel-plugin-ng-annotate
```

## How to setup

#### CLI
```js
$ babel --stage 0 --plugins ng-annotate script.js
```

#### Require hook
```js
require("babel").transform("code", { stage: 0, plugins: ["ng-annotate"] });
```

#### Browserify

```js
var b = browserify({
  // options
}).transform(
  babelify.configure({
    stage: 0,
    plugins: ["ng-annotate"]
  })
);
```

## How to use

```js
@Inject('service1', 'service2', 'service3')
class MyController {

    constructor() {
        this.service1();
    }

    method() {
        this.service2();
    }

    anotherMethod() {
        this.service3();
    }
}

angular.controller('MyController', MyController);
```