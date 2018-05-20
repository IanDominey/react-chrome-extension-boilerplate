describe('inject page (in github.com)', () => {

  beforeAll(async () => {
    await driver.get('https://github.com');
  });

  it('should open Github', async () => {
    const title = await driver.getTitle();
    return await expect(title).toBe('The world’s leading software development platform · GitHub');
  });

  it('should render inject app', async () => {
    const elements = await driver.findElements(By.className('inject-react-example'));
    return await expect(elements).not.toHaveLength(0);
  });

  it('should find `Open TodoApp` button', async () => {
    const button = await driver.wait(
      () => driver.findElements(By.css('.inject-react-example button')),
      10000
    );
    return await expect(button).not.toHaveLength(0);
  });

  it('should find iframe', async () => {
    await driver.findElement(By.css('.inject-react-example button')).click();
    const iframe = await driver.wait(
      () => driver.findElements(By.css('.inject-react-example iframe')),
      10000
    );
    return await expect(iframe).not.toHaveLength(0);
  });
});
