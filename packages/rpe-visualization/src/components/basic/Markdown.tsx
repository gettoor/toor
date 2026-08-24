import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function Markdown({ content }: { content: string }) {
  const parsed = marked.parse(content, { async: false });
  const html = DOMPurify.sanitize(parsed);
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}