import _ from 'lodash';

export default class ContainerCommands {
  constructor(containerId, nativeCommandsSender, layoutTreeParser, layoutTreeCrawler) {
    this.containerId = containerId;
    this.nativeCommandsSender = nativeCommandsSender;
    this.layoutTreeParser = layoutTreeParser;
    this.layoutTreeCrawler = layoutTreeCrawler;
  }

  push(containerData) {
    const input = _.cloneDeep(containerData);
    const layout = this.layoutTreeParser.createContainer(input);
    this.layoutTreeCrawler.crawl(layout);
    return this.nativeCommandsSender.push(this.containerId, layout);
  }
}
