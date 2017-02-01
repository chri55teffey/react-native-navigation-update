import NativeCommandsSender from '../adapters/NativeCommandsSender.mock';
import UniqueIdProvider from '../adapters/UniqueIdProvider.mock';
import Store from '../containers/Store';
import LayoutTreeParser from './LayoutTreeParser';
import LayoutTreeCrawler from './LayoutTreeCrawler';

import ContainerCommands from './ContainerCommands';

describe('ContainerCommands', () => {
  let uut;
  let mockCommandsSender;
  const containerId = 'myUniqueId';

  beforeEach(() => {
    mockCommandsSender = new NativeCommandsSender();
    uut = new ContainerCommands(containerId, mockCommandsSender, new LayoutTreeParser(), new LayoutTreeCrawler(new UniqueIdProvider(), new Store()));
  });

  it('holds containerId', () => {
    expect(uut.containerId).toEqual('myUniqueId');
  });

  describe('push', () => {
    it('deep clones input to avoid mutation errors', () => {
      const obj = {};
      uut.push({ inner: { foo: obj } });
      expect(mockCommandsSender.push.mock.calls[0][1].data.inner.foo).not.toBe(obj);
    });

    it('resolves with the parsed layout', async () => {
      mockCommandsSender.push.mockReturnValue(Promise.resolve('the resolved layout'));
      const result = await uut.push({ name: 'com.example.MyScreen' });
      expect(result).toEqual('the resolved layout');
    });

    it('parses into correct layout node and sends to native', () => {
      uut.push({ name: 'com.example.MyScreen' });
      expect(mockCommandsSender.push).toHaveBeenCalledTimes(1);
      expect(mockCommandsSender.push).toHaveBeenCalledWith('myUniqueId', {
        type: 'Container',
        id: 'Container+UNIQUE_ID',
        data: { name: 'com.example.MyScreen' },
        children: []
      });
    });
  });
});
