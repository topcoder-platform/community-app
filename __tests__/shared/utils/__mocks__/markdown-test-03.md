# Markdown Test #03

This test covers custom inline elements:
- **Button** <Button to="/url" type="submit">Text</Button>
- **PrimaryButton** <PrimaryButton to="test/url">Label</Button>
- **SecondaryButton** <SecondaryButton to="secondary/url">Label</SecondaryButton>
- **Link**: <Link to="somewhere>Link text</Link>
- **JoinCommunity**: <JoinCommunity label="Join Now" />

Nested buttons:
<Button to="outer/url">
  <Button to="inner/url">
    Inner label
  </Button>
  Outer label
</Button>
