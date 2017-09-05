const React = require('react');
require('react-native');
const renderer = require('react-test-renderer');

describe('remx support', () => {
  let MyConnectedContainer;
  let store;

  beforeEach(() => {
    MyConnectedContainer = require('./MyContainer');
    store = require('./MyStore');
  });

  it('renders normally', () => {
    const tree = renderer.create(<MyConnectedContainer />);
    expect(tree.toJSON().children).toEqual(['no name']);
  });

  it('rerenders as a result of an underlying state change (by selector)', () => {
    const renderCountIncrement = jest.fn();
    const tree = renderer.create(<MyConnectedContainer renderCountIncrement={renderCountIncrement} />);

    expect(tree.toJSON().children).toEqual(['no name']);
    expect(renderCountIncrement).toHaveBeenCalledTimes(1);

    store.setters.setName('Bob');
    expect(store.getters.getName()).toEqual('Bob');
    expect(tree.toJSON().children).toEqual(['Bob']);

    expect(renderCountIncrement).toHaveBeenCalledTimes(2);
  });

  it('rerenders as a result of an underlying state change with a new key', () => {
    const renderCountIncrement = jest.fn();
    const tree = renderer.create(<MyConnectedContainer printAge={true} renderCountIncrement={renderCountIncrement} />);

    expect(tree.toJSON().children).toEqual(null);
    expect(renderCountIncrement).toHaveBeenCalledTimes(1);

    store.setters.setAge(30);
    expect(store.getters.getAge()).toEqual(30);
    expect(tree.toJSON().children).toEqual(['30']);

    expect(renderCountIncrement).toHaveBeenCalledTimes(2);
  });
});
