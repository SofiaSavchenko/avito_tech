import { test, expect, Page, Locator } from '@playwright/test';

const URL = `http://tech-avito-intern.jumpingcrab.com/`

const data = {
  title: 'Picture',
  price: '1234',
  description: '1234',
  imageUrl: `https://avatars.mds.yandex.net/i?id=ebe3001c1965aa24b6823851682ee885_l-5254775-images-thumbs&n=13`
};

const getLocators = (page: Page) => ({
  createButton: () => page.getByRole('button', { name: 'Создать' }),
  saveButton: () => page.getByRole('button', { name: 'Сохранить' }),
  searchBox: () => page.locator('input[placeholder="Поиск по объявлениям"]'),
  searchButton: () => page.getByRole('button', { name: 'Найти' }),
  titleInput: () => page.getByRole('textbox', { name: 'Название' }),
  priceInput: () => page.getByRole('spinbutton', { name: 'Цена' }),
  descriptionInput: () => page.getByRole('textbox', { name: 'Описание' }),
  descriptionChange: () => page.locator('textarea[name="description"]'),
  imageInput: () => page.getByRole('textbox', { name: 'Ссылка на изображение' }),
  link: (id: any) => page.locator(`a[href="/advertisements/${id}"]`),
  editButton: () => page.locator('svg[style="cursor: pointer;"]'),
  updatedDescription: () => page.locator('p.chakra-text.css-i3jkqk'),
  expectedLink: () => page.locator(`a:has-text("${data.title}")`).first(),
  resultCount: () => page.locator('p.chakra-text.css-1axtg79')
});


test('Создание объявления', async ({ page }) => {

  const locators = getLocators(page);
  const uniqueTitle = `${data.title} ${Date.now()}`;

  await page.goto(URL);

  await locators.createButton().click();

  await locators.titleInput().click();
  await locators.titleInput().fill(uniqueTitle);

  await locators.priceInput().click();
  await locators.priceInput().fill(data.price);

  await locators.descriptionInput().click();
  await locators.descriptionInput().fill(data.description);

  await locators.imageInput().click();
  await locators.imageInput().fill(data.imageUrl);

  await locators.saveButton().click();

});

test('Редактирование объявления', async ({ page }) => {

  const locators = getLocators(page);
  const id = '3';

  await page.goto(URL);

  await locators.link(id).click();

  await locators.editButton().click();

  await locators.descriptionChange().click()
  await locators.descriptionChange().fill(data.description);

  await locators.editButton().click();

  await expect(locators.updatedDescription()).toContainText(data.description);

});

test('Поиск объявлений', async ({ page }) => {

  const locators = getLocators(page);

  await page.goto(URL);

  await locators.searchBox().click()
  await locators.searchBox().fill(data.title);

  await locators.searchButton().click();

  await expect(locators.expectedLink()).toBeVisible();

  await expect(locators.resultCount()).toContainText(/Найдено: [1-9][0-9]*/);

});
