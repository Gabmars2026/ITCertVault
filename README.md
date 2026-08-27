# AI News Now

A dark AI-news dashboard with real working navigation routes and an automatic RSS collector that does not require a paid news API or API key.

## Pages
Home, Breaking, ChatGPT, Claude, Gemini, AI Models, AI Video, AI Images, Coding, Hardware, Robotics, Business, All News, Search, Subscribe, and About.

## Automatic news
`api/news.js` reads public RSS feeds from TechCrunch AI, The Verge AI, VentureBeat AI, and Hugging Face. Responses are cached for 15 minutes, obvious duplicate headlines are removed, and full stories open at the original publisher.

The favicon is a custom AI-brain icon matching the purple/blue visual direction of the site.