import React from 'react';
import { mount } from 'enzyme';
import TodoTextInput from '../../../app/components/TodoTextInput';
import style from '../../../app/components/TodoTextInput.css';

const getInput = renderer => renderer.childAt(0);

function setup(propOverrides) {
  const props = {
    onSave: jest.fn(),
    text: 'Use Redux',
    placeholder: 'What needs to be done?',
    editing: false,
    newTodo: false,
    ...propOverrides
  };


  const renderer = mount(<TodoTextInput {...props} />);
  const input = getInput(renderer);

  return { props, renderer, input };
}

describe('todoapp TodoTextInput component', () => {
  it('should render correctly', () => {
    const { input } = setup();
    expect(input.prop('placeholder')).toBe('What needs to be done?');
    expect(input.prop('value')).toBe('Use Redux');
    expect(input.prop('className')).toBe('');
  });

  it('should render correctly when editing=true', () => {
    const { input } = setup({ editing: true });
    expect(input.hasClass(style.edit)).toBe(true);
  });

  it('should render correctly when newTodo=true', () => {
    const { input } = setup({ newTodo: true });
    expect(input.hasClass(style.new)).toBe(true);
  });

  it('should update value on change', () => {
    const { renderer, input } = setup();
    input.prop('onChange')({ target: { value: 'Use Radox' } });
    renderer.update();
    expect(getInput(renderer).prop('value')).toBe('Use Radox');
  });

  it('should call onSave on return key press', () => {
    const { input, props } = setup();
    input.prop('onKeyDown')({ which: 13, target: { value: 'Use Redux' } });
    expect(props.onSave).toBeCalledWith('Use Redux');
  });

  it('should reset state on return key press if newTodo', () => {
    const { renderer, input } = setup({ newTodo: true });
    input.prop('onKeyDown')({ which: 13, target: { value: 'Use Redux' } });
    renderer.update();
    expect(getInput(renderer).prop('value')).toBe('');
  });

  it('should call onSave on blur', () => {
    const { input, props } = setup();
    input.prop('onBlur')({ target: { value: 'Use Redux' } });
    expect(props.onSave).toBeCalledWith('Use Redux');
  });

  it('shouldn\'t call onSave on blur if newTodo', () => {
    const { input, props } = setup({ newTodo: true });
    input.prop('onBlur')({ target: { value: 'Use Redux' } });
    expect(props.onSave).not.toBeCalled();
  });
});
