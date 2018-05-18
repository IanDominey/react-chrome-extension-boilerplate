import React from 'react';
import { mount } from 'enzyme';
import TodoItem from '../../../app/components/TodoItem';
import style from '../../../app/components/TodoItem.css';
import TodoTextInput from '../../../app/components/TodoTextInput';

const getLi = renderer => renderer.childAt(0);

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

  if (editing) {
    renderer.find('label').prop('onDoubleClick')({});
    renderer.update();
  }

  const li = getLi(renderer);

  return { props, renderer, li };
}

describe('todoapp TodoItem component', () => {
  it('should render correctly', () => {
    const { li } = setup();

    expect(li.name()).toBe('li');
    expect(li.hasClass(style.normal)).toBe(true);

    const div = li.childAt(0);

    expect(div.name()).toBe('div');
    expect(div.hasClass(style.view)).toBe(true);

    const input = div.childAt(0);
    const label = div.childAt(1);
    const button = div.childAt(2);

    expect(input.name()).toBe('input');
    expect(input.prop('checked')).toBe(false);

    expect(label.name()).toBe('label');
    expect(label.text()).toBe('Use Redux');

    expect(button.name()).toBe('button');
    expect(button.hasClass(style.destroy)).toBe(true);
  });

  it('input onChange should call completeTodo', () => {
    const { renderer, props } = setup();
    const input = renderer.find('input');
    input.prop('onChange')({});
    expect(props.completeTodo).toBeCalledWith(0);
  });

  it('button onClick should call deleteTodo', () => {
    const { renderer, props } = setup();
    const button = renderer.find('button');
    button.prop('onClick')({});
    expect(props.deleteTodo).toBeCalledWith(0);
  });

  it('label onDoubleClick should put component in edit state', () => {
    const { renderer } = setup();
    const label = renderer.find('label');
    label.prop('onDoubleClick')({});
    renderer.update();
    const li = getLi(renderer);
    expect(li.type()).toBe('li');
    expect(li.hasClass(style.editing)).toBe(true);
  });

  it('edit state render', () => {
    const { li } = setup(true);

    expect(li.type()).toBe('li');
    expect(li.hasClass(style.editing)).toBe(true);

    const input = li.find('TodoTextInput');
    expect(input.type()).toBe(TodoTextInput);
    expect(input.prop('text')).toBe('Use Redux');
    expect(input.prop('editing')).toBe(true);
  });

  it('TodoTextInput onSave should call editTodo', () => {
    const { renderer, props } = setup(true);
    renderer.find('TodoTextInput').prop('onSave')('Use Redux');
    expect(props.editTodo).toBeCalledWith(0, 'Use Redux');
  });

  it('TodoTextInput onSave should call deleteTodo if text is empty', () => {
    const { renderer, props } = setup(true);
    renderer.find('TodoTextInput').prop('onSave')('');
    expect(props.deleteTodo).toBeCalledWith(0);
  });

  it('TodoTextInput onSave should exit component from edit state', () => {
    const { renderer } = setup(true);
    renderer.find('TodoTextInput').prop('onSave')('Use Redux');
    renderer.update();
    const li = getLi(renderer);
    expect(li.type()).toBe('li');
    expect(li.hasClass(style.normal)).toBe(true);
  });
});
