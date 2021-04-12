const staticCacheName = 's-app-v1'
const dynamicCacheName = 'd-app-v1'

const assetUrls = [
  "./assets/css/icons.css",
  "./assets/css/main.css",
  "./assets/css/page.css",
  "./assets/css/quill.css",
  "./assets/css/uikit.css",
  "./assets/fonts/fa-light-300.ttf",
  "./assets/fonts/Abram.ttf",
  "./assets/fonts/Anselmo.ttf",
  "./assets/fonts/Benvolio.ttf",
  "./assets/fonts/Capuletty.ttf",
  "./assets/fonts/Djiovanni.ttf",
  "./assets/fonts/Eskal.ttf",
  "./assets/fonts/Gregory.ttf",
  "./assets/fonts/Lexa.ttf",
  "./assets/fonts/Lorenco.ttf",
  "./assets/fonts/Merk.ttf",
  "./assets/fonts/Montekky.ttf",
  "./assets/fonts/Pag.ttf",
  "./assets/fonts/Paris.ttf",
  "./assets/fonts/Roboto Condensed.ttf",
  "./assets/fonts/Salavat.ttf",
  "./assets/fonts/Samson.ttf",
  "./assets/fonts/shriftone.ttf",
  "./assets/fonts/Stefano.ttf",
  "./assets/img/logo.png",
  "./assets/img/Page1.png",
  "./assets/img/Page2.png",
  "./assets/img/Page1_line.png",
  "./assets/img/Page2_line.png",
  "./assets/js/columnizer.js",
  "./assets/js/dom-to-image.min.js",
  "./assets/js/FileSaver.min.js",
  "./assets/js/jspdf.min.js",
  "./assets/js/jszip.min.js",
  "./assets/js/main.js",
  "./assets/js/quill_setting.js",
  "./assets/js/quill.min.js",
  "./assets/js/render.min.js",
  "./assets/js/uikit.min.js",
  "./index.html",
  "./offline.html"
]

self.addEventListener('install', async event => {
  const cache = await caches.open(staticCacheName)
  await cache.addAll(assetUrls)
})

self.addEventListener('activate', async event => {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCacheName)
      .filter(name => name !== dynamicCacheName)
      .map(name => caches.delete(name))
  )
})

self.addEventListener('fetch', event => {
  const {request} = event

  const url = new URL(request.url)
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request))
  } else {
    event.respondWith(networkFirst(request))
  }
})


async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached ?? await fetch(request)
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request)
    await cache.put(request, response.clone())
    return response
  } catch (e) {
    const cached = await cache.match(request)
    return cached ?? await caches.match('/offline.html')
  }
}