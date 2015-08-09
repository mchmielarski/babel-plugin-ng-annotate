export default function Inject(...args) {
  return function(target) {
    target.$inject = args;
  }
}