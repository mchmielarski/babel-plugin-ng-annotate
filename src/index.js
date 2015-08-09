export default function ({ Plugin, types: t }) {

  function rebuildConstructor(node, fromDecorator) {
    let insertIndex = 0;
    fromDecorator.forEach(p => {
      node.value.params.push(t.identifier(p));
      node.value.body.body.splice(
        insertIndex,
        0,
        t.expressionStatement(
          t.assignmentExpression(
            "=",
            t.memberExpression(t.thisExpression(), t.identifier(p)),
            t.identifier(p)
          )
        )
      );
      insertIndex++;
    });
    return node;
  }

  return new Plugin("ng-annotate", {
    visitor: {
      ClassDeclaration(node, parent, scope, file) {
        if (!node.decorators) {
          return;
        }

        let fromDecorator = [];
        let doInjection = false;
        let i, j;
        let hasConstructor = false;

        for (i = 0; i < node.decorators.length; i++) {
          let ex = node.decorators[i].expression;
          if (t.isCallExpression(ex) && t.isIdentifier(ex.callee, {name: "Inject"})) {
            doInjection = true;
            for (j = 0; j < ex.arguments.length; j++) {
              fromDecorator.push(ex.arguments[j].value);
            }
          }
        }

        if (doInjection) {
          file.set("hasInject", true);
          node.body.body.forEach(child => {
            if (!hasConstructor && t.isMethodDefinition(child, {kind: "constructor"})) {
              rebuildConstructor(child, fromDecorator)
            }
          });

          if (!hasConstructor) {
            let constructorNode = t.methodDefinition(
              t.identifier("constructor"),
              t.functionExpression(null, [], t.blockStatement([])),
              "constructor",
              true
            );
            node.body.body.unshift(rebuildConstructor(constructorNode, fromDecorator));
          }
        }
      },

      Program: {
        enter: function (node, parent, scope, file) {
          file.set("hasInject", false);
        },

        exit: function (node, parent, scope, file) {
          if (file.get("hasInject") && !scope.hasBinding("Inject")) {
            node.body.unshift(t.variableDeclaration(
              "let",
              [t.variableDeclarator(
                t.identifier("Inject"),
                t.callExpression(t.identifier("require"), [t.literal("babel-plugin-ng-annotate/lib/inject")])
              )]
            ));
          }
        }
      }
    }
  });
}