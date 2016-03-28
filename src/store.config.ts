/**
 * Input Class
*/
export class StoreConfig {
  public baseUri: string
  constructor(config:any = {}) {
    config = config || {};

    // TODO
    // Sanitze inputs

    // bulk assign
    Object.assign(this, config);
  }
}
