import React from 'react';
import { mount } from 'enzyme';
import TodoItem from '../../../app/components/TodoItem';
import style from '../../../app/components/TodoItem.css';
import TodoTextInput from '../../../app/components/TodoTextInput';

function setup(editing = false) {
  const props = {
    todo: {
      id: 0,
      text: 'Use Redux',
      completed: false
    },
    editTodo: jest.fn(),
    deleteTodo: jest.fn(),
    completeTodo: jest.fn()
  };

  const renderer = mount(<TodoItem {...props} />);

  return { props, renderer };
}

describe('todoapp TodoItem component', () => {
  it('should render correctly', () => {
    const { renderer } = setup();

    expect(renderer.name()).toBe('li');
    expect(renderer.hasClass(style.normal)).toBe(true);

    const div = renderer.children();

    expect(div.name()).toBe('div');
    expect(div.hasClass(style.view)).toBe(true);

    const [input, label, button] = div.children();

    expect(input.name()).toBe('input');
    expect(input.prop('checked')).toBe(false);

    expect(label.name()).toBe('label');
    expect(label.text()).toBe('Use Redux');

    expect(button.name()).toBe('button');
    expect(button.hasClass(style.destroy)).toBe(true);
  });

  it('input onChange should call completeTodo', () => {
    const { output, props } = setup();
    const input = output.props.children.props.children[0];
    input.props.onChange({});
    expect(props.completeTodo.calledWith(0)).toBe(true);
  });

  it('button onClick should call deleteTodo', () => {
    const { output, props } = setup();
    const button = output.props.children.props.children[2];
    button.props.onClick({});
    expect(props.deleteTodo.calledWith(0)).toBe(true);
  });

  it('label onDoubleClick should put component in edit state', () => {
    const { output, renderer } = setup();
    const label = output.props.children.props.children[1];
    label.props.onDoubleClick({});
    const updated = renderer.getRenderOutput();
    expect(updated.type).toBe('li');
    expect(updated.props.className).toBe(style.editing);
  });

  it('edit state render', () => {
    const { output } = setup(true);

    expect(output.type).toBe('li');
    expect(output.props.className).toBe(style.editing);

    const input = output.props.children;
    expect(input.type).toBe(TodoTextInput);
    expect(input.props.text).toBe('Use Redux');
    expect(input.props.editing).toBe(true);
  });

  it('TodoTextInput onSave should call editTodo', () => {
    const { output, props } = setup(true);
    output.props.children.props.onSave('Use Redux');
    expect(props.editTodo.calledWith(0, 'Use Redux')).toBe(true);
  });

  it('TodoTextInput onSave should call deleteTodo if text is empty', () => {
    const { output, props } = setup(true);
    output.props.children.props.onSave('');
    expect(props.deleteTodo.calledWith(0)).toBe(true);
  });

  it('TodoTextInput onSave should exit component from edit state', () => {
    const { output, renderer } = setup(true);
    output.props.children.props.onSave('Use Redux');
    const updated = renderer.getRenderOutput();
    expect(updated.type).toBe('li');
    expect(updated.props.className).toBe(style.normal);
  });
});
