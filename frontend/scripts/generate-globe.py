"""Render a static orthographic NASA Blue Marble basemap. No trend data here."""
from pathlib import Path
from io import BytesIO
from urllib.request import urlopen
import numpy as np
from PIL import Image

URL = 'https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography-bathymetry/january/world.topo.bathy.200401.3x5400x2700.jpg'
texture = np.asarray(Image.open(BytesIO(urlopen(URL, timeout=30).read())).convert('RGB'))
size = 1100
y, x = np.mgrid[0:size, 0:size].astype(float)
x = (x - (size - 1) / 2) / (size / 2 - 1)
y = -(y - (size - 1) / 2) / (size / 2 - 1)
r2 = x*x + y*y
z = np.sqrt(np.maximum(0, 1-r2))
lat0, lon0 = np.radians(-12), np.radians(-58)
lat = np.arcsin(np.clip(z*np.sin(lat0) + y*np.cos(lat0), -1, 1))
lon = lon0 + np.arctan2(x, z*np.cos(lat0)-y*np.sin(lat0))
u = ((lon + np.pi) / (2*np.pi) * texture.shape[1]).astype(int) % texture.shape[1]
v = np.clip(((np.pi/2-lat) / np.pi * texture.shape[0]).astype(int), 0, texture.shape[0]-1)
rgb = texture[v, u].astype(float)
light = np.maximum(0, -.36*x + .30*y + .88*z)
rgb *= (.35 + .65*light)[..., None]
rgba = np.zeros((size,size,4), dtype=np.uint8)
rgba[...,:3] = np.clip(rgb,0,255).astype(np.uint8)
rgba[...,3] = np.where(r2<=1,255,0).astype(np.uint8)
out = Path(__file__).resolve().parent.parent / 'public/assets/globe.webp'
Image.fromarray(rgba).save(out, 'WEBP', quality=86, method=6)
print(f'{out}: {out.stat().st_size:,} bytes')
