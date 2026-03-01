/**
 * Utility for basic HTML to Markdown conversion (and vice-versa).
 */

export function htmlToMarkdown(html: string): string {
    if (!html) return "";

    let md = html;

    // Line breaks
    md = md.replace(/<br\s*\/?>/gi, "\n");
    md = md.replace(/<\/p>/gi, "\n\n");
    md = md.replace(/<p>/gi, "");

    // Bold
    md = md.replace(/<(b|strong)>(.*?)<\/\1>/gi, "**$2**");

    // Italic
    md = md.replace(/<(i|em)>(.*?)<\/\1>/gi, "_$2_");

    // Links
    md = md.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");

    // Lists
    md = md.replace(/<li>(.*?)<\/li>/gi, "- $1\n");
    md = md.replace(/<\/?(ul|ol)>/gi, "\n");

    // Remove remaining tags (like span)
    md = md.replace(/<[^>]+>/g, "");

    // Decode HTML entities (basic ones)
    md = md.replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"');

    return md.trim();
}

export function markdownToHtml(md: string): string {
    if (!md) return "";

    let html = md;

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/_(.*?)_/g, "<em>$1</em>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Lists (simplified)
    html = html.replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>");

    // Paragraphs/Breaks
    html = html.replace(/\n\n/g, "</p><p>");
    html = html.replace(/\n/g, "<br>");

    if (html.includes("<p>") || html.includes("<br>")) {
        html = `<p>${html}</p>`;
    }

    return html;
}
