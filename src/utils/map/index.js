import getPixels from 'get-pixels'
import { PlaneBufferGeometry, Mesh, MeshNormalMaterial, Group } from 'three'
import tilebelt from '@mapbox/tilebelt'
import QuadTextureMaterial from './quad-texture-material'
import scales from './scales.json'

const tileMaterial = new MeshNormalMaterial({ wireframe: true })

class Utils {
  static tile2position(z, x, y, center, tileSize) {
    const offsetAtZ = (z) => {
      return {
        x: center.x / Math.pow(2, 10 - z),
        y: center.y / Math.pow(2, 10 - z)
      }
    }
    const offset = offsetAtZ(z)
    return {
      x: (x - center.x - (offset.x % 1) + (center.x % 1)) * tileSize,
      y: (-y + center.y + (offset.y % 1) - (center.y % 1)) * tileSize,
      z: 0
    }
  }

  static getTileKey(z, x, y) {
    return `${z}/${x}/${y}`
  }
}
class Source {
  constructor(api, token, options) {
    this.supportedApis = {
      osm: this.mapUrlOSM.bind(this),
      mapbox: this.mapUrlMapbox.bind(this),
      eox: this.mapUrlSentinel2Cloudless.bind(this),
      maptiler: this.mapUrlmapTiler.bind(this)
    }
    if (!(api in this.supportedApis)) {
      throw new Error('Unknown source api')
    }
    this.api = api
    this.token = token
    this.options = options
  }

  mapUrlOSM(z, x, y) {
    return `https://c.tile.openstreetmap.org/${z}/${x}/${y}.png`
  }

  mapUrlMapbox(z, x, y) {
    return `https://api.mapbox.com/v4/mapbox.satellite/${z}/${x}/${y}@2x.jpg80?access_token=${this.token}`
  }

  mapUrlSentinel2Cloudless(z, x, y) {
    // cf. https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml
    return `https://tiles.maps.eox.at/wmts?layer=s2cloudless_3857&style=default&tilematrixset=g&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix=${z}&TileCol=${x}&TileRow=${y}`
  }

  mapUrlmapTiler(z, x, y) {
    return `https://api.maptiler.com/tiles/satellite/${z}/${x}/${y}.jpg?key=${this.token}`
  }

  mapUrl(z, x, y) {
    return this.supportedApis[this.api](z, x, y)
  }
}

class Tile {
  constructor(map, z, x, y, materialOptions) {
    this.map = map
    this.z = z
    this.x = x
    this.y = y
    this.size = this.map.options.tileSize
    this.position = Utils.tile2position(
      this.z,
      this.x,
      this.y,
      this.map.center,
      this.size
    )
    this.baseURL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium'
    this.shape = null
    this.elevation = null
    this.seamX = false
    this.seamY = false
    this.materialOptions = materialOptions
  }

  key() {
    return Utils.getTileKey(this.z, this.x, this.y)
  }
  keyNeighX() {
    return `${this.z}/${this.x + 1}/${this.y}`
  }
  keyNeighY() {
    return `${this.z}/${this.x}/${this.y + 1}`
  }

  url() {
    return `${this.baseURL}/${this.z}/${this.x}/${this.y}.png`
  }

  mapUrl() {
    return this.map.source.mapUrl(this.z, this.x, this.y)
  }

  computeElevation(pixels) {
    this.shape = pixels.shape
    const elevation = new Float32Array(pixels.shape[0] * pixels.shape[1])
    for (let i = 0; i < pixels.shape[0]; i++) {
      for (let j = 0; j < pixels.shape[1]; j++) {
        const ij = i + pixels.shape[0] * j
        const rgba = ij * 4
        elevation[ij] =
          pixels.data[rgba] * 256.0 +
          pixels.data[rgba + 1] +
          pixels.data[rgba + 2] / 256.0 -
          32768.0
      }
    }
    this.elevation = elevation
  }

  buildGeometry() {
    const geometry = new PlaneBufferGeometry(
      this.size,
      this.size,
      this.map.options.tileSegments,
      this.map.options.tileSegments
    )
    const nPosition = Math.sqrt(geometry.attributes.position.count)
    const nElevation = Math.sqrt(this.elevation.length)
    const ratio = nElevation / (nPosition - 1)
    let x, y
    for (let i = 0; i < geometry.attributes.position.count - nPosition; i++) {
      if (i % nPosition === nPosition - 1) continue
      x = Math.floor(i / nPosition)
      y = i % nPosition

      const elevation =
        this.elevation[
          Math.round(Math.round(x * ratio) * nElevation + y * ratio)
        ] * this.map.options.zScale

      geometry.attributes.position.setZ(i, elevation)
    }
    geometry.computeVertexNormals()
    this.geometry = geometry
  }

  childrens() {
    return [
      new Tile(
        this.map,
        this.z + 1,
        this.x * 2,
        this.y * 2,
        this.materialOptions
      ),
      new Tile(
        this.map,
        this.z + 1,
        this.x * 2,
        this.y * 2 + 1,
        this.materialOptions
      ),
      new Tile(
        this.map,
        this.z + 1,
        this.x * 2 + 1,
        this.y * 2,
        this.materialOptions
      ),
      new Tile(
        this.map,
        this.z + 1,
        this.x * 2 + 1,
        this.y * 2 + 1,
        this.materialOptions
      )
    ]
  }

  buildMaterial() {
    const urls = this.childrens().map((tile) => tile.mapUrl())
    return QuadTextureMaterial(urls, this.materialOptions)
  }

  buildmesh() {
    this.buildMaterial().then((material) => {
      this.mesh.material = material
    })
    this.mesh = new Mesh(this.geometry, tileMaterial)
  }

  fetch() {
    return new Promise((resolve) => {
      getPixels(this.url(), (err, pixels) => {
        if (err) console.error(err)
        this.computeElevation(pixels)
        this.buildGeometry()
        this.buildmesh()
        this.mesh.position.set(...Object.values(this.position))
        resolve(this)
      })
    })
  }

  resolveSeamY(neighbor) {
    const tPosition = this.mesh.geometry.attributes.position.count
    const nPosition = Math.sqrt(tPosition)
    const nPositionN = Math.sqrt(
      neighbor.mesh.geometry.attributes.position.count
    )
    if (nPosition !== nPositionN) {
      console.error('resolveSeamY only implemented for geometries of same size')
      return
    }
    for (let i = tPosition - nPosition; i < tPosition; i++) {
      this.mesh.geometry.attributes.position.setZ(
        i,
        neighbor.mesh.geometry.attributes.position.getZ(
          i - (tPosition - nPosition)
        )
      )
    }
  }

  resolveSeamX(neighbor) {
    const tPosition = this.mesh.geometry.attributes.position.count
    const nPosition = Math.sqrt(tPosition)
    const nPositionN = Math.sqrt(
      neighbor.mesh.geometry.attributes.position.count
    )
    if (nPosition !== nPositionN) {
      console.error('resolveSeamX only implemented for geometries of same size')
      return
    }
    for (let i = nPosition - 1; i < tPosition; i += nPosition) {
      this.mesh.geometry.attributes.position.setZ(
        i,
        neighbor.mesh.geometry.attributes.position.getZ(i - nPosition + 1)
      )
    }
  }

  resolveSeams(cache) {
    let worked = false
    const neighY = cache[this.keyNeighY()]
    const neighX = cache[this.keyNeighX()]
    if (this.seamY === false && neighY && neighY.mesh) {
      this.resolveSeamY(neighY)
      this.seamY = true
      worked = true
    }
    if (this.seamX === false && neighX && neighX.mesh) {
      this.resolveSeamX(neighX)
      this.seamX = true
      worked = true
    }
    if (worked) {
      this.mesh.geometry.attributes.position.needsUpdate = true
      this.mesh.geometry.computeVertexNormals()
    }
  }
}

class Map {
  constructor({ source, location, options = {}, material = {} }) {
    this.source = source
    this.geoLocation = location

    this.materialOptions = material
    this.options = this.getOptions(options)
    this.nTiles = this.options.nTiles
    this.zoom = this.options.zoom
    this.tileSize = this.options.tileSize

    this.terrain = new Group()
    this.tileCache = {}
  }

  defaultOptions = {
    nTiles: 3,
    zoom: 11,
    tileSize: 600,
    tileSegments: 100
  }

  getOptions(providedOptions) {
    const options = Object.assign({}, this.defaultOptions, providedOptions)
    options.zScale = scales[options.zoom]
    options.tileSegments = Math.min(256, Math.round(options.tileSegments))
    return options
  }

  init(callback = () => {}) {
    const [lat, lng] = this.geoLocation
    const [x, y] = tilebelt.pointToTile(lng, lat, this.zoom)
    this.center = { x, y }

    const tileOffset = Math.floor(this.nTiles / 2)

    for (let i = 0; i < this.nTiles; i++) {
      for (let j = 0; j < this.nTiles; j++) {
        const tile = new Tile(
          this,
          this.zoom,
          this.center.x + i - tileOffset,
          this.center.y + j - tileOffset,
          this.materialOptions
        )
        this.tileCache[tile.key()] = tile

        if (i === this.nTiles - 1 && j === this.nTiles - 1) {
          callback()
        }
      }
    }

    const promises = Object.values(this.tileCache).map((tile) => {
      return tile.fetch().then((tile) => {
        this.terrain.add(tile.mesh)
        return tile
      })
    })

    Promise.all(promises).then((tiles) => {
      tiles.reverse().forEach((tile) => {
        // reverse to avoid seams artifacts
        tile.resolveSeams(this.tileCache)
      })
    })
    // this.onReady()
  }

  addTileSegment(x, y) {
    const tile = new Tile(this, this.zoom, x, y, this.materialOptions)

    if (tile.key() in this.tileCache) return

    this.tileCache[tile.key()] = tile
    tile
      .fetch()
      .then((tile) => {
        this.terrain.add(tile.mesh)
      })
      .then(() => {
        Object.values(this.tileCache).forEach((tile) =>
          tile.resolveSeams(this.tileCache)
        )
      })
  }

  clean() {
    Object.values(this.tileCache).forEach((tile) => {
      this.terrain.remove(tile.mesh)
      tile.mesh.geometry.dispose()
      ;['mapSW', 'mapNW', 'mapSE', 'mapNE'].forEach((key) =>
        tile.mesh.material.uniforms[key].value.dispose()
      )
      tile.mesh.material.dispose()
    })
    this.tileCache = {}
  }

  getProjection([lat, lng, alt], providedOptions) {
    const defaultOptions = { loadTile: true }
    const opts = Object.assign({}, defaultOptions, providedOptions)

    const { options, zoom, tileCache, center, tileSize } = this
    const { zScale } = options

    const [x, y, z] = tilebelt.pointToTile(lng, lat, zoom)
    const tileKey = Utils.getTileKey(z, x, y)

    if (opts.loadTile && !(tileKey in tileCache)) this.addTileSegment(x, y)

    const [w, s, e, n] = tilebelt.tileToBBOX([x, y, z])
    const position = Utils.tile2position(z, x, y, center, tileSize)

    const xStart = position.x - tileSize / 2
    const yStart = position.y - tileSize / 2

    const xOffset = tileSize * (1 - (e - lng) / (e - w))
    const yOffset = tileSize * (1 - (n - lat) / (n - s))

    return [xStart + xOffset, yStart + yOffset, alt * zScale]
  }
}

export { Map, Source }
