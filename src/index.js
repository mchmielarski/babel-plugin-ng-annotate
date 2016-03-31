export default function ({ types: t }) {
  return {
    visitor: {
      ClassDeclaration(path) {
        if (!path.node.decorators) {
          return;
        }
        const inject = path.node.decorators.find(decorator => decorator.expression.callee.name === 'Inject');

        if (!inject) {
          return;
        }
        path.node.decorators = path.node.decorators.splice(path.node.decorators.indexOf(inject), 1);

        const toInject = inject.expression.arguments.map(arg => arg.value);
        let ctor = path.node.body.body.find(el => el.kind === 'constructor');
        let toParam;

        if (!ctor) {
          ctor = t.classMethod(
            'constructor',
            t.identifier('constructor'),
            [],
            t.blockStatement([])
          );
          if (path.node.superClass) {
            ctor.body.body.unshift(
              t.expressionStatement(t.callExpression(t.super(), []))
            );
          }
          path.node.body.body.unshift(ctor);
          toParam = toInject;
        } else {
          toParam = toInject.filter(param => !ctor.params.find(p => p.name === param));
        }

        toParam.forEach(i => {
          let fCmd;
          let sup;
          if (Array.isArray(ctor.body.body)) {
            fCmd = ctor.body.body[0];
          } else {
            fCmd = ctor.body.body;
          }
          if (fCmd && fCmd.expression && fCmd.expression.callee && fCmd.expression.callee.type === 'Super') {
            sup = ctor.body.body.shift();
          }

          ctor.body.body.unshift(
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(t.thisExpression(), t.identifier(i)),
                t.identifier(i)
              )
            )
          );

          if (sup) {
            ctor.body.body.unshift(sup);
          }
        })

        ctor.params = ctor.params.concat(toParam.map(i => t.identifier(i)));

        const injectExp = t.expressionStatement(t.assignmentExpression(
          '=',
          t.memberExpression(
            t.identifier(path.node.id.name),
            t.identifier('$inject')),
          t.arrayExpression(toInject.map(d => t.stringLiteral(d)))
        ));

        if (path.parentPath.type === 'ExportNamedDeclaration') {
          path.parentPath.insertAfter(injectExp);
        } else {
          path.insertAfter(injectExp);
        }
      }
    }
  };
};
