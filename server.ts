import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import https from 'https';
import path from 'path';

interface YTSearchResult {
  videoId: string;
  title: string;
  author: string;
  duration: string;
  thumbnail: string;
}

function searchYouTube(query: string): Promise<YTSearchResult[]> {
  return new Promise((resolve) => {
    const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    const options = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
    };

    https
      .get(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const match = data.match(/ytInitialData\s*=\s*({.+?});<\/script>/);
            if (!match) return resolve([]);
            const json = JSON.parse(match[1]);
            const sectionList =
              json.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
            const videos: YTSearchResult[] = [];

            for (const section of sectionList) {
              const items = section.itemSectionRenderer?.contents || [];
              for (const item of items) {
                const v = item.videoRenderer;
                if (v && v.videoId) {
                  const title =
                    v.title?.runs?.map((r: { text: string }) => r.text).join('') || v.title?.simpleText || '';
                  const author =
                    v.ownerText?.runs?.map((r: { text: string }) => r.text).join('') ||
                    v.longBylineText?.runs?.map((r: { text: string }) => r.text).join('') ||
                    'YouTube Music';
                  const duration = v.lengthText?.simpleText || (v.badges ? 'LIVE' : 'Audio');
                  const thumbList = v.thumbnail?.thumbnails || [];
                  const thumb = thumbList.length > 0 ? thumbList[thumbList.length - 1].url : '';

                  videos.push({
                    videoId: v.videoId,
                    title,
                    author,
                    duration,
                    thumbnail: thumb,
                  });
                }
              }
            }
            resolve(videos.slice(0, 10));
          } catch (err) {
            console.error('[YouTube Search Parse Error]:', err);
            resolve([]);
          }
        });
      })
      .on('error', (err) => {
        console.error('[YouTube Search HTTP Error]:', err);
        resolve([]);
      });
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API para buscar pistas directamente en YouTube
  app.get('/api/youtube/search', async (req: Request, res: Response) => {
    const query = (req.query.q as string) || '';
    if (!query.trim()) {
      return res.json({ results: [] });
    }

    try {
      const results = await searchYouTube(query.trim());
      res.json({ results });
    } catch (err) {
      console.error('[API Route Error]:', err);
      res.status(500).json({ error: 'Error en búsqueda de YouTube', results: [] });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SoundVibe] Servidor full-stack activo en http://0.0.0.0:${PORT}`);
  });
}

startServer();
