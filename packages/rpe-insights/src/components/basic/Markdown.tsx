import { marked } from 'marked';
import DOMPurify from 'dompurify';

export interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) { 
  const preprocessed = content.replace(/\n/g, '<br/>');
  const parsed = marked.parse(preprocessed, { async: false });
  const html = DOMPurify.sanitize(parsed);
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
