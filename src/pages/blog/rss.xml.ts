import type { APIRoute } from 'astro';
import blog from '../../data/blog.json';
import site from '../../data/site.json';
import type { BlogPost } from '../../types';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildContent(post: BlogPost) {
  if (!post.sections?.length) return `<p>${post.excerpt}</p>`;
  return post.sections
    .map((section) => {
      const heading = `<h2>${section.heading}</h2>`;
      const paragraphs = (section.paragraphs || []).map((p) => `<p>${p}</p>`).join('');
      return `${heading}${paragraphs}`;
    })
    .join('');
}

export const GET: APIRoute = () => {
  const posts = (blog as BlogPost[])
    .filter((post) => post.status === 'published')
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  const items = posts
    .map((post) => {
      const link = `${site.domain}/blog/${post.slug}`;
      const pubDate = new Date(post.publishDate).toUTCString();
      const content = buildContent(post);

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ''}
      ${post.author ? `<dc:creator>${escapeXml(post.author)}</dc:creator>` : ''}
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(`${site.brand} Blog`)}</title>
    <link>${site.domain}/blog</link>
    <description>${escapeXml('Plain-English insights on websites, data scraping, and custom software — from a developer who ships for real businesses.')}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site.domain}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${site.domain}${site.seo?.ogImage || '/media/team/shubham.jpg'}</url>
      <title>${escapeXml(site.brand)}</title>
      <link>${site.domain}/blog</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
