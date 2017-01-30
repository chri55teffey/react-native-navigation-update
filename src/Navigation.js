import NativeCommandsSender from './adapters/NativeCommandsSender';
import NativeEventsReceiver from './adapters/NativeEventsReceiver';
import UniqueIdProvider from './adapters/UniqueIdProvider';

import Store from './containers/Store';
import ContainerRegistry from './containers/ContainerRegistry';
import Commands from './commands/Commands';

class Navigation {
  constructor() {
    this.store = new Store();
    this.nativeEventsReceiver = new NativeEventsReceiver();
    this.uniqueIdProvider = new UniqueIdProvider();
    this.containerRegistry = new ContainerRegistry(this.store);
    this.commands = new Commands(new NativeCommandsSender(), this.uniqueIdProvider);
  }

  registerContainer(containerName, getContainerFunc) {
    this.containerRegistry.registerContainer(containerName, getContainerFunc);
  }

  setRoot(params) {
    this.commands.setRoot(params);
  }

  events() {
    return this.nativeEventsReceiver;
  }
}

const singleton = new Navigation();
module.exports = singleton;
