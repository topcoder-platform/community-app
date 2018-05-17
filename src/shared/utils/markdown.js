import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export default function render(text) {
  return md.render(text);
}
