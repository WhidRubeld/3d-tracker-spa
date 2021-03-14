import { ShaderMaterial, TextureLoader, UniformsLib } from 'three'
import vertexShader from './quadtexture_vert.glsl'
import fragmentShader from './quadtexture_frag.glsl'

const loader = new TextureLoader()

const defaultOptions = {
  lights: true,
  wireframe: true,
  fog: true
}

const QuadTextureMaterial = (urls, options) => {
  return Promise.all(urls.map((url) => loader.loadAsync(url))).then((maps) => {
    const opts = {
      uniforms: {
        mapNW: { value: maps[0] },
        mapSW: { value: maps[1] },
        mapNE: { value: maps[2] },
        mapSE: { value: maps[3] },
        ...UniformsLib.common,
        ...UniformsLib.lights,
        ...UniformsLib.fog
      },
      vertexShader,
      fragmentShader,
      defines: {
        USE_MAP: true,
        USE_UV: true
      }
    }

    return new ShaderMaterial({
      ...opts,
      ...Object.assign(defaultOptions, options)
    })
  })
}

export default QuadTextureMaterial
