import React from 'react';
import { mount } from 'enzyme';
import TodoTextInput from '../../../app/components/TodoTextInput';
import style from '../../../app/components/TodoTextInput.css';

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

  return { props, renderer };
}

describe('todoapp TodoTextInput component', () => {
  it('should render correctly', () => {
    const { renderer } = setup();
    const input = renderer.childAt(0);
    expect(input.prop('placeholder')).toBe('What needs to be done?');
    expect(input.prop('value')).toBe('Use Redux');
    expect(input.prop('className')).toBe('');
  });

  it('should render correctly when editing=true', () => {
    const { renderer } = setup({ editing: true });
    expect(renderer.hasClass(style.edit)).toBe(true);
  });

  it('should render correctly when newTodo=true', () => {
    const { renderer } = setup({ newTodo: true });
    expect(renderer.hasClass(style.new)).toBe(true);
  });

  it('should update value on change', () => {
    const { renderer } = setup();
    const input = renderer.first();
    input.simulate('change', { target: { value: 'Use Radox' } });
    expect(input.prop('value')).toBe('Use Radox');
  });

  it('should call onSave on return key press', () => {
    const { renderer, props } = setup();
    renderer.props.onKeyDown({ which: 13, target: { value: 'Use Redux' } });
    expect(props.onSave).toBeCalledWith('Use Redux');
  });

  it('should reset state on return key press if newTodo', () => {
    const { renderer } = setup({ newTodo: true });
    renderer.props.onKeyDown({ which: 13, target: { value: 'Use Redux' } });
    const updated = renderer.getRenderrenderer();
    expect(updated.props.value).toBe('');
  });

  it('should call onSave on blur', () => {
    const { renderer, props } = setup();
    renderer.props.onBlur({ target: { value: 'Use Redux' } });
    expect(props.onSave).toBeCalledWith('Use Redux');
  });

  it('shouldnt call onSave on blur if newTodo', () => {
    const { renderer, props } = setup({ newTodo: true });
    renderer.props.onBlur({ target: { value: 'Use Redux' } });
    expect(props.onSave.calls.length).toBe(0);
  });
});
