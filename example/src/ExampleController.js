
@Inject('$exService')
export class ExampleController {

  constructor() {
    this.data = '';
  }

  load() {
    this.$exService
      .getData()
      .then(data => {
        this.data = data;
      });
  }
}
