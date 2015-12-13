# babel-plugin-ng-annotate - babel 6.x

## How to install

```
$ npm install --save-dev babel-plugin-ng-annotate
```

## How to setup

#### .babelrc
```js
{
  "presets": ["es2015"],
  "plugins": ["syntax-decorators", "ng-annotate"]
}
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
