xdescribe('remx support', () => {
  let React;
  let renderer;
  let MyConnectedScreen;
  let store;

  beforeEach(() => {
    require('react-native');
    React = require('react');
    renderer = require('react-test-renderer');
    MyConnectedScreen = require('./remx-support-component').default;
    store = require('./remx-support-store');
  });

  it('renders normally', () => {
    const tree = renderer.create(<MyConnectedScreen/>);
    expect(tree.toJSON().children).toEqual(['no name']);
  });

  it('rerenders as a result of an underlying state change (by selector)', () => {
    const tree = renderer.create(<MyConnectedScreen/>);
    const instance = tree.getInstance();
    expect(tree.toJSON().children).toEqual(['no name']);
    expect(instance.renders).toEqual(1);
    store.mutators.setName('Bob');
    expect(tree.toJSON().children).toEqual(['no name']);
    expect(instance.renders).toEqual(2);
  });
});
