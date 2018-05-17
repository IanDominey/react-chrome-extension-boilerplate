import React from 'react';
import { mount } from 'enzyme';
import Footer from '../../../app/components/Footer';
import style from '../../../app/components/Footer.css';
import { SHOW_ACTIVE, SHOW_ALL } from '../../../app/constants/TodoFilters';

function setup(propOverrides) {
  const props = {
    completedCount: 0,
    activeCount: 0,
    filter: SHOW_ALL,
    onClearCompleted: jest.fn(),
    onShow: jest.fn(),
    ...propOverrides,
  };

  const renderer = mount(<Footer {...props} />);

  return { props, renderer };
}


describe('todoapp Footer component', () => {
  it('should be a footer', () => {
    const { renderer } = setup();
    expect(renderer.type()).toBe(Footer);
    renderer.hasClass(style.footer);
  });

  it('should display active count when 0', () => {
    const { renderer } = setup({ activeCount: 0 });
    expect(renderer.find(`.${style.todoCount}`).text()).toBe('No items left');
  });

  it('should display active count when above 0', () => {
    const { renderer } = setup({ activeCount: 1 });
    expect(renderer.find(`.${style.todoCount}`).text()).toBe('1 item left');
  });

  it('should render filters', () => {
    const { renderer } = setup();
    const filters = renderer.find(`.${style.filters}`);
    expect(filters.name()).toBe('ul');
    expect(filters.children()).toHaveLength(3);
    filters.children().forEach((filter, index) => {
      expect(filter.name()).toBe('li');
      const link = filter.children();
      const shouldBeSelected = (index === 0);
      expect(link.hasClass('selected')).toBe(shouldBeSelected);
      expect(link.text()).toBe(['All', 'Active', 'Completed'][index]);
    });
  });

  it('should call onShow when a filter is clicked', () => {
    const { renderer, props } = setup();
    const filters = renderer.find(`.${style.filters}`);
    const filterLink = filters.childAt(1).children();
    filterLink.simulate('click');
    expect(props.onShow).toBeCalledWith(SHOW_ACTIVE);
  });

  it('shouldnt show clear button when no completed todos', () => {
    const { renderer } = setup({ completedCount: 0 });
    const clear = renderer.find(`button.${style.clearCompleted}`);
    expect(clear).toHaveLength(0);
  });

  it('should render clear button when completed todos', () => {
    const { renderer } = setup({ completedCount: 1 });
    const clear = renderer.find(`button.${style.clearCompleted}`);
    expect(clear.name()).toBe('button');
    expect(clear.text()).toBe('Clear completed');
  });

  it('should call onClearCompleted on clear button click', () => {
    const { renderer, props } = setup({ completedCount: 1 });
    const clear = renderer.find(`button.${style.clearCompleted}`);
    clear.simulate('click');
    expect(props.onClearCompleted).toBeCalled();
  });
});
