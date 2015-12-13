export default function({ types: t }) {
  return {
    visitor: {
      ClassDeclaration(path) {
        if (!path.node.decorators) {
          return;
        }

        console.log(path.node);

        const inject = path.node.decorators.find(decorator => decorator.expression.callee.name === 'Inject');

        if(!inject) {
          return;
        }
        path.node.decorators = path.node.decorators.splice(path.node.decorators.indexOf(inject), 1);

        const toInject = inject.expression.arguments.map(arg => arg.value);
        let ctor = path.node.body.body.find(el => el.kind === 'constructor');
        let toParam;

        if(!ctor) {
          ctor = t.classMethod(
            'constructor',
            t.identifier('constructor'),
            [],
            t.blockStatement([])
          );
          path.node.body.body.unshift(ctor);
          toParam = toInject;
        } else {
          toParam = toInject.filter(param => !ctor.params.find(p => p.name === param));
        }

        toParam.forEach(i => {
          ctor.body.body.unshift(
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(t.thisExpression(), t.identifier(i)),
                t.identifier(i)
              )
            )
          );
        })

        ctor.params = ctor.params.concat(toParam.map(i => t.identifier(i)));

        path.insertAfter(t.expressionStatement(t.assignmentExpression(
          '=',
          t.memberExpression(
            t.identifier(path.node.id.name),
            t.identifier('$inject')),
            t.arrayExpression(toInject.map(d => t.stringLiteral(d)))
          )
        ));
      }
    }
  };
};
