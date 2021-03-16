# Miscellaneous CSS Solutions

## Align Button To Bottom of Cards
Example: https://community-app.topcoder.com/examples/contentful/viewport/4fr7QZfF2qh9PWEhtBmOZ3

The containing viewport uses `Row with Max-Width` theme. Each `contentBlocks` inside it are extended with following CSS: 

Content-Wrapper
```
{
    "height": "100%"
}
```

Content
```
{
    "display": "flex",
    "flex-direction": "column",
    "justify-content": "space-between",
    "flex": "auto"
}
```

## Position banner content left/right
Put this custom CSS on content field.
```
{
    "margin-left/right": "calc(100vw - 50%)
}
```
