import React from 'react';
import { mount } from 'enzyme';
import Header from '../../../app/components/Header';
import TodoTextInput from '../../../app/components/TodoTextInput';

function setup() {
  const props = {
    addTodo: jest.fn()
  };

  const renderer = mount(<Header {...props} />);

  return { props, renderer };
}

const newValue = (value, enterKey = false) => ({
  target: { value },
  which: (enterKey ? 13 : undefined)
});

describe('todoapp Header component', () => {
  it('should render correctly', () => {
    const { renderer } = setup();

    expect(renderer.type()).toBe(Header);

    expect(renderer.find('h1').text()).toBe('todos');

    const input = renderer.find('TodoTextInput');

    expect(input.type()).toBe(TodoTextInput);
    expect(input.prop('newTodo')).toBe(true);
    expect(input.prop('placeholder')).toBe('What needs to be done?');
  });

  it('should call addTodo if length of text is greater than 0', () => {
    const { renderer, props } = setup();
    const input = renderer.find('input');
    input.simulate('keyDown', newValue(''));
    expect(props.addTodo).toHaveBeenCalledTimes(0);
    input.simulate('keyDown', newValue('Use Redux', true));
    expect(props.addTodo).toHaveBeenCalledTimes(1);
  });
});
