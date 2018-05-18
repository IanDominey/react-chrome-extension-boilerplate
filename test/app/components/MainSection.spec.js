import React from 'react';
import { mount } from 'enzyme';
import MainSection from '../../../app/components/MainSection';
import style from '../../../app/components/MainSection.css';
import TodoItem from '../../../app/components/TodoItem';
import Footer from '../../../app/components/Footer';
import { SHOW_ALL, SHOW_COMPLETED } from '../../../app/constants/TodoFilters';

const getFooter = n => n.find('Footer');

function setup(propOverrides) {
  const props = {
    todos: [{
      text: 'Use Redux',
      completed: false,
      id: 0,
    }, {
      text: 'Run the tests',
      completed: true,
      id: 1,
    }],
    actions: {
      editTodo: jest.fn(),
      deleteTodo: jest.fn(),
      completeTodo: jest.fn(),
      completeAll: jest.fn(),
      clearCompleted: jest.fn(),
    },
    ...propOverrides,
  };

  const renderer = mount(<MainSection {...props} />);

  return { props, renderer };
}


describe('todoapp MainSection component', () => {
  it('should render correctly', () => {
    const { renderer } = setup();
    const section = renderer.childAt(0);
    expect(section.name()).toBe('section');
    expect(section.hasClass(style.main)).toBe(true);
  });

  describe('toggle all input', () => {
    it('should render', () => {
      const { renderer } = setup();
      const toggle = renderer.find(`.${style.toggleAll}`);
      expect(toggle.type()).toBe('input');
      expect(toggle.prop('type')).toBe('checkbox');
      expect(toggle.prop('checked')).toBe(false);
    });

    it('should be checked if all todos completed', () => {
      const { renderer } = setup({
        todos: [{
          text: 'Use Redux',
          completed: true,
          id: 0,
        }],
      });
      const toggle = renderer.find(`.${style.toggleAll}`);
      expect(toggle.prop('checked')).toBe(true);
    });

    it('should call completeAll on change', () => {
      const { renderer, props } = setup();
      const toggle = renderer.find(`.${style.toggleAll}`);
      toggle.prop('onChange')({});
      expect(props.actions.completeAll).toBeCalled();
    });
  });

  describe('footer', () => {
    it('should render', () => {
      const { renderer } = setup();
      const footer = getFooter(renderer);
      expect(footer.type()).toBe(Footer);
      expect(footer.prop('completedCount')).toBe(1);
      expect(footer.prop('activeCount')).toBe(1);
      expect(footer.prop('filter')).toBe(SHOW_ALL);
    });

    it('onShow should set the filter', () => {
      const { renderer } = setup();
      const footer = getFooter(renderer);
      footer.prop('onShow')(SHOW_COMPLETED);
      renderer.update();
      const updatedFooter = getFooter(renderer);
      expect(updatedFooter.prop('filter')).toBe(SHOW_COMPLETED);
    });

    it('onClearCompleted should call clearCompleted', () => {
      const { renderer, props } = setup();
      const footer = getFooter(renderer);
      footer.prop('onClearCompleted')();
      renderer.update();
      expect(props.actions.clearCompleted).toBeCalled();
    });

    it(
        'onClearCompleted shouldn\'t call clearCompleted if no todos completed',
        () => {
          const { renderer, props } = setup({
            todos: [{
              text: 'Use Redux',
              completed: false,
              id: 0,
            }],
          });
          const footer = getFooter(renderer);
          footer.prop('onClearCompleted')();
          expect(props.actions.clearCompleted).not.toBeCalled();
        }
    );
  });

  describe('todo list', () => {
    it('should render', () => {
      const { renderer, props } = setup();
      const list = renderer.find(`.${style.todoList}`)
      expect(list.type()).toBe('ul');
      expect(list.children().length).toBe(2);
      list.children().forEach((item, index) => {
        expect(item.type()).toBe(TodoItem);
        expect(item.prop('todo')).toBe(props.todos[index]);
      });
    });

    it('should filter items', () => {
      const { renderer, props } = setup();
      const showCompletedLink = renderer.find('ul a').findWhere(
          n => n.type() === 'a' && n.text() === 'Completed'
      );
      showCompletedLink.simulate('click');
      const updatedlist = renderer.find(`ul.${style.todoList}`).children();
      expect(updatedlist).toHaveLength(1);
      expect(updatedlist.prop('todo')).toBe(props.todos[1]);
    });
  });
})
;
