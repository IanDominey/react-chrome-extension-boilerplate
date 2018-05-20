import footerStyle from '../../app/components/Footer.css';
import mainSectionStyle from '../../app/components/MainSection.css';
import todoItemStyle from '../../app/components/TodoItem.css';
import todoTextInputStyle from '../../app/components/TodoTextInput.css';
import manifest from '../../chrome/manifest.prod.json';

const extensionName = manifest.name;

const findList = driver =>
  driver.findElements(By.css(`.${mainSectionStyle.todoList} > li`));

const addTodo = async (driver, key) => {
  // add todo
  // driver.findElement(By.className(todoTextInputStyle.new))
  //   .sendKeys(key + Key.RETURN);
  const todos = await findList(driver);
  return { todo: todos[0], count: todos.length };
};

const editTodo = async (driver, index, key) => {
  let todos = await findList(driver);
  const label = todos[index].findElement(By.css('label'));
  // dbl click to enable textarea
  await driver.actions().doubleClick(label).perform();
  // typing & enter
  // driver.actions().sendKeys(key + Key.RETURN).perform();

  todos = await findList(driver);
  return { todo: todos[index], count: todos.length };
};

const completeTodo = async (driver, index) => {
  let todos = await findList(driver);
  todos[index].findElement(By.className(todoItemStyle.toggle)).click();
  todos = await findList(driver);
  return { todo: todos[index], count: todos.length };
};

const deleteTodo = async (driver, index) => {
  let todos = await findList(driver);
  driver.executeScript(
    `document.querySelectorAll('.${mainSectionStyle.todoList} > li')[${index}]
      .getElementsByClassName('${todoItemStyle.destroy}')[0].style.display = 'block'`
  );
  todos[index].findElement(By.className(todoItemStyle.destroy)).click();
  todos = await findList(driver);
  return { count: todos.length };
};

describe('window (popup) page', () => {
  let driver;

  beforeAll(async () => {
    await driver.get('chrome://extensions-frame');
    const elems = await driver.findElements(By.xpath(
      '//div[contains(@class, "extension-list-item-wrapper") and ' +
      `.//h2[contains(text(), "${extensionName}")]]`
    ));
    const extensionId = await elems[0].getAttribute('id');
    await driver.get(`chrome-extension://${extensionId}/window.html`);
  });

  it('should open Redux TodoMVC Example', async () => {
    const title = await driver.getTitle();
    expect(title).toBe('Redux TodoMVC Example (Window)');
  });

  it('should can add todo', async () => {
    const { todo, count } = await addTodo(driver, 'Add tests');
    expect(count).toBe(2);
    const text = await todo.findElement(By.tagName('label')).getText();
    expect(text).toBe('Add tests');
  });

  it('should can edit todo', async () => {
    const { todo, count } = await editTodo(driver, 0, 'Ya ');
    expect(count).toBe(2);
    const text = await todo.findElement(By.tagName('label')).getText();
    expect(text).toBe('Ya Add tests');
  });

  it('should can complete todo', async () => {
    const { todo, count } = await completeTodo(driver, 0);
    expect(count).toBe(2);
    const className = await todo.getAttribute('class');
    const { completed, normal } = todoItemStyle;
    expect(className).toBe(`${completed} ${normal}`);
  });

  it('should can complete all todos', async () => {
    driver.findElement(By.className(mainSectionStyle.toggleAll)).click();
    const todos = await findList(driver);
    const classNames = await Promise.all(todos.map(todo => todo.getAttribute('class')));
    const { completed, normal } = todoItemStyle;
    expect(classNames.every(name => name === `${completed} ${normal}`)).toBe(true);
  });

  it('should can delete todo', async () => {
    const { count } = await deleteTodo(driver, 0);
    expect(count).toBe(1);
  });

  it(
    'should can clear completed todos if completed todos count > 0',
    async () => {
      // current todo count: 1
      await addTodo(driver, 'Add 1');
      const { count } = await addTodo(driver, 'Add 2');
      expect(count).toBe(3);

      await completeTodo(driver, 0);
      driver.findElement(By.className(footerStyle.clearCompleted)).click();

      const todos = await findList(driver);
      const classNames = await Promise.all(todos.map(todo => todo.getAttribute('class')));
      expect(classNames.every(name => name !== 'completed')).toBe(true);
    }
  );

  it(
    'should cannot clear completed todos if completed todos count = 0',
    async () => {
      const todos = await driver.findElements(By.className(footerStyle.clearCompleted));
      expect(todos).toHaveLength(0);
    }
  );

  it('should can filter active todos', async () => {
    // current todo count: 2
    await addTodo(driver, 'Add 1');
    const { count } = await addTodo(driver, 'Add 2');
    expect(count).toBe(3);

    await completeTodo(driver, 0);
    let todos = await driver.findElements(By.css(`.${footerStyle.filters} > li`));
    todos[1].click();
    await delay(1000);
    todos = await findList(driver);
    expect(todos).toHaveLength(2);
  });

  it('should can filter completed todos', async () => {
    // current todo count: 2
    let todos = await driver.findElements(By.css(`.${footerStyle.filters} > li`));
    todos[2].click();
    await delay(1000);
    todos = await findList(driver);
    expect(todos).toHaveLength(1);
  });
});
