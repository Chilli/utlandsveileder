import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { transform } from 'sucrase';

const port = 4173;
const root = process.cwd();

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/jsx; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

createServer(async (req, res) => {
  try {
    const url = req.url === '/' ? '/index.html' : req.url;
    const requestPath = decodeURIComponent(url.split('?')[0]).replace(/^\//, '');
    const filePath = join(root, requestPath || 'index.html');
    const content = await readFile(filePath, 'utf8');
    const extension = extname(filePath);
    const responseBody = extension === '.jsx'
      ? transform(content, { transforms: ['jsx'] }).code
      : content;

    res.writeHead(200, {
      'Content-Type': extension === '.jsx' ? 'text/javascript; charset=utf-8' : (contentTypes[extension] || 'text/plain; charset=utf-8'),
      'Cache-Control': 'no-store',
    });
    res.end(responseBody);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Preview running at http://127.0.0.1:${port}`);
});
