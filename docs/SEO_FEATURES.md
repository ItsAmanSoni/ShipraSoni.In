New blog posts will automatically be searchable, and here's how it works:

  ✅ Automatic Process

  When you create a new MDX blog post in src/app/blog/posts/:

  1. Sitemap Auto-Updates

  - Your sitemap (/sitemap.xml) is dynamically generated
  - It automatically scans the posts directory using getPosts()
  - New blog posts are instantly added to the sitemap
  - Each post gets proper metadata (URL, last modified, priority 0.7, weekly changefreq)

  2. SEO Metadata Auto-Generated

  Each blog post automatically gets:
  - Title & Description from MDX frontmatter
  - Open Graph tags for social sharing
  - Twitter Cards for Twitter previews
  - Structured Data (JSON-LD) with BlogPosting schema (src/app/blog/[slug]/page.tsx:78-95)
  - Canonical URLs

  3. What You Need to Do

  When you add a new blog post:

  Option A - Let Google discover naturally:
  - Google will recrawl your sitemap periodically (every few days to weeks)
  - New posts will be indexed automatically

  Option B - Speed up indexing (Recommended):
  1. Go to Google Search Console
  2. Navigate to "Sitemaps"
  3. You'll see your sitemap status
  4. Google recrawls automatically, but you can also:
    - Go to "URL Inspection"
    - Paste your new blog post URL
    - Click "Request Indexing"

  📝 Creating a New Blog Post

  Here's the process:

  1. Create a new .mdx file in src/app/blog/posts/:

  # Example: my-new-post.mdx

  2. Add frontmatter metadata:

  ---
  title: "Your Blog Post Title"
  summary: "A compelling 150-160 character description with keywords"
  publishedAt: "2025-01-15"
  image: "/images/blog/my-post.jpeg"
  tag: "Development"
  ---

  ## Your Content Here

  Write your blog post content...

  3. Build and deploy:

  npm run build
  vercel --prod

  4. Verify it's in the sitemap:

  Visit: https://www.amansoni.in/sitemap.xml

  You should see your new post:
  <url>
    <loc>https://www.amansoni.in/blog/my-new-post</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  ⚡ Indexing Timeline

  - Immediate: Post appears in sitemap
  - Hours to days: Google discovers the new post
  - Days to weeks: Post appears in search results
  - Weeks to months: Post builds ranking authority

  🚀 Speed Up Discovery

  To help Google find your new posts faster:

  1. Submit to Google Search Console (one-time per post)

  URL Inspection → Enter blog URL → Request Indexing

  2. Internal Linking

  - Link to new posts from existing popular posts
  - Your site already shows "Recent posts" at the bottom of blog pages (src/app/blog/[slug]/page.tsx:150)

  3. Share on Social Media

  - Twitter/X
  - LinkedIn
  - Your social links
  - This creates backlinks and signals

  4. Update Homepage or Main Blog Page

  - Your blog page already lists recent posts
  - Google crawls your homepage frequently

  🎯 SEO Best Practices for Blog Posts

  Frontmatter Optimization:

  ---
  title: "Use Keywords Early - Max 60 Characters"
  summary: "Include target keywords naturally. Keep it compelling and under 160 characters for best snippet display."
  publishedAt: "2025-01-15"  # Use current date
  image: "/images/blog/descriptive-name.jpeg"  # Use descriptive filenames
  tag: "Development"  # Relevant category
  ---

  Content Structure:

  ## Use H2 for Main Sections

  Break content into scannable sections with clear headings.

  ### Use H3 for Subsections

  Include:
  - Lists for readability
  - **Bold** for emphasis
  - Code examples
  - Images with descriptive alt text

  Internal Linking:

  Check out my previous post on [React patterns](/blog/react-patterns)
  or view my [portfolio projects](/work).

  📊 Monitor Your Blog Posts

  Track performance in Google Search Console:

  1. Performance Tab:
    - Filter by page: /blog/your-post
    - See impressions, clicks, CTR, position
  2. Coverage Tab:
    - Ensure posts are "Valid" and indexed
    - Check for any errors
  3. Enhancements:
    - Verify structured data is working
    - Check Core Web Vitals

  ✨ Your Setup is Already Optimized