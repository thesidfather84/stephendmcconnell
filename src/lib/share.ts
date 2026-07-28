export const EMAIL_ARTICLE_SUBJECT = "Interesting Kidney Health Research from Stephen D. McConnell";

export function buildEmailArticleLink(url: string): string {
  const body = `I thought you might find this educational resource helpful.\n\n${url}\n\nThis information is intended for education and discussion with qualified healthcare professionals.`;
  return `mailto:?subject=${encodeURIComponent(EMAIL_ARTICLE_SUBJECT)}&body=${encodeURIComponent(body)}`;
}

export function buildShareLinks(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: buildEmailArticleLink(url),
  };
}
