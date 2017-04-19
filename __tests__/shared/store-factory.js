
test('it should support devtools in development environment', async () => {
  process.env.NODE_ENV = 'development';
  const storeFactory = require('shared/store-factory').default;
  const store = await storeFactory();
  expect(store.liftedStore).toBeDefined();
});
