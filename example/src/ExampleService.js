@Inject('$http')
class ExampleService {

  getData() {
    return this.$http.get('...');
  }
}

export default ExampleService;
