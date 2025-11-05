import { Request, Response, NextFunction } from "express";
import { Readable } from "stream";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const OSM_TILE_BASE = "https://tile.openstreetmap.org";
const USER_AGENT =
  process.env.OSM_USER_AGENT || "ParvatGuard/1.0 (+https://parvatguard.app)";

export async function searchPlaces(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const q = (req.query.q as string) || "";
    const limit = (req.query.limit as string) || "8";
    if (!q || q.trim().length < 2) {
      res.json([]);
      return;
    }

    const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(
      q
    )}&limit=${encodeURIComponent(limit)}&addressdetails=0`;
    const upstream = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT,
      },
    });
    const text = await upstream.text();
    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "application/json"
    );
    // Short cache to ease Nominatim load while keeping results fresh
    res.setHeader("Cache-Control", "public, max-age=300");
    res.status(upstream.status).send(text);
  } catch (err) {
    next(err);
  }
}

export async function proxyTile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { z, x, y } = req.params as { z: string; x: string; y: string };
    if (!/^[0-9]+$/.test(z) || !/^[0-9]+$/.test(x) || !/^[0-9]+$/.test(y)) {
      res.status(400).json({ error: "Invalid tile coordinates" });
      return;
    }
    const url = `${OSM_TILE_BASE}/${encodeURIComponent(z)}/${encodeURIComponent(
      x
    )}/${encodeURIComponent(y)}.png`;
    const upstream = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "image/png,image/*;q=0.8,*/*;q=0.5",
      },
    });
    // Pass through content-type and etag for client/proxy caching
    const contentType = upstream.headers.get("content-type") || "image/png";
    const etag = upstream.headers.get("etag");
    if (etag) res.setHeader("ETag", etag);
    res.setHeader("Content-Type", contentType);
    // Cache tiles for a day
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
    // Stream the body
    if (!upstream.body) {
      res.status(502).json({ error: "Upstream tile fetch failed" });
      return;
    }
    const webStream = upstream.body as unknown as ReadableStream<Uint8Array>;
    const nodeStream = Readable.fromWeb(webStream);
    nodeStream.pipe(res);
  } catch (err) {
    next(err);
  }
}
