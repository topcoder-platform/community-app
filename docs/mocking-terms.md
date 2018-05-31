# Mocking Terms for Testing and Development

Development and testing related to challenges and communities terms is not straightforward because in dev. environment related functionality does not work perfect, and in prod. it is not possible to reset agreement for a terms without admin privileges. Thus, we have a mock of terms service that helps to nail development, and also to write related unit-tests with Jest.

### Development

To enable terms mocking for development, run the app with `MOCK_TERMS_SERVICE` environment variable set to `true`. E.g., on Linux, in dev. mode against production backend, you execute `$ MOCK_TERMS_SERVICE=true NODE_CONFIG_ENV=production PORT=80 npm run dev`. Against development backend it would be simply `$ MOCK_TERMS_SERVICE=true npm run dev`.

With this option enabled, each challenge and community you access will be protected by two terms if user is not authenticated: a simple Topcoder ones + mock DocuSign NDA (really simple mock, renders a small HTML page, that shows buttons that, when pressed, imitate DocuSign callbacks in the cases of terms agreement or rejection). If a user is authenticated then each challenge and community will be protected by three terms one of which is agreed. By default, two terms won't be agreed initially. Agreeing with them won't be stored in the service mock though after all terms agreed `checkStatusDone` action will return all terms agreed. If you reload a page, you'll see that both terms are pending to be agreed with again.

The code of the mock module, and mock data for it, can be found in the `topcoder-react-lib/src/services/__mocks__` folder. You can modify them for your development and testing need, but, please, don't commit these changes to the repo, as we are planning to write unit-tests using this mock (if there is a really good reason to update the mock, be sure to check that related unit-tests are updated appropriately as well).

### Unit-Testing

Using this terms mock for unit-testing with Jest is straightforward: you add to an unit-test module `jest.mock('services/terms')`, and the module will be mocked using the same logic as for development.
