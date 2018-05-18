import React from 'react';
import { mount } from 'enzyme';
import MainSection from '../../../app/components/MainSection';
import style from '../../../app/components/MainSection.css';
import TodoItem from '../../../app/components/TodoItem';
import Footer from '../../../app/components/Footer';
import { SHOW_ALL, SHOW_COMPLETED } from '../../../app/constants/TodoFilters';

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
    expect(renderer.first().name()).toBe('section');
    expect(renderer).hasClass(style.main);
  });

  describe('toggle all input', () => {
    it('should render', () => {
      const { output } = setup();
      const [toggle] = output.props.children;
      expect(toggle.type).toBe('input');
      expect(toggle.props.type).toBe('checkbox');
      expect(toggle.props.checked).toBe(false);
    });

    it('should be checked if all todos completed', () => {
      const { output } = setup({
        todos: [{
          text: 'Use Redux',
          completed: true,
          id: 0,
        }],
      });
      const [toggle] = output.props.children;
      expect(toggle.props.checked).toBe(true);
    });

    it('should call completeAll on change', () => {
      const { output, props } = setup();
      const [toggle] = output.props.children;
      toggle.props.onChange({});
      expect(props.actions.completeAll.called).toBe(true);
    });
  });

  describe('footer', () => {
    it('should render', () => {
      const { output } = setup();
      const [, , footer] = output.props.children;
      expect(footer.type).toBe(Footer);
      expect(footer.props.completedCount).toBe(1);
      expect(footer.props.activeCount).toBe(1);
      expect(footer.props.filter).toBe(SHOW_ALL);
    });

    it('onShow should set the filter', () => {
      const { output, renderer } = setup();
      const [, , footer] = output.props.children;
      footer.props.onShow(SHOW_COMPLETED);
      const updated = renderer.getRenderOutput();
      const [, , updatedFooter] = updated.props.children;
      expect(updatedFooter.props.filter).toBe(SHOW_COMPLETED);
    });

    it('onClearCompleted should call clearCompleted', () => {
      const { output, props } = setup();
      const [, , footer] = output.props.children;
      footer.props.onClearCompleted();
      expect(props.actions.clearCompleted.called).toBe(true);
    });

    it(
        'onClearCompleted shouldnt call clearCompleted if no todos completed',
        () => {
          const { output, props } = setup({
            todos: [{
              text: 'Use Redux',
              completed: false,
              id: 0,
            }],
          });
          const [, , footer] = output.props.children;
          footer.props.onClearCompleted();
          expect(props.actions.clearCompleted.callCount).toBe(0);
        }
    );
  });

  describe('todo list', () => {
    it('should render', () => {
      const { output, props } = setup();
      const [, list] = output.props.children;
      expect(list.type).toBe('ul');
      expect(list.props.children.length).toBe(2);
      list.props.children.forEach((item, index) => {
        expect(item.type).toBe(TodoItem);
        expect(item.props.todo).toBe(props.todos[index]);
      });
    });

    it('should filter items', () => {
      const { renderer, props } = setup();
      const showCompletedLink = renderer.find('footer > a').findWhere((n) => n.text() === SHOW_COMPLETED);
      console.log(showCompletedLink.debug());

      expect(renderer.getProp(children).length).toBe(1);
      expect(updatedList.props.children[0].props.todo).toBe(props.todos[1]);
    });
  });
});
