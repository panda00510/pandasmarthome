import { MeshStandardMaterial, Color } from 'three'

/**
 * 把烘焙好的全局光照接进标准材质。
 *
 * 九盏灯分三张贴图，每张的 R/G/B 各存一盏灯的完整 GI（白光烘的，所以是纯强度）。
 * 运行时按每盏灯当前的开关、亮度、颜色加权求和，叠加到直接光照上 ——
 * 开关灯依然实时，但每盏灯的光都带着 Cycles 算出来的墙面反弹。
 *
 * 走 onBeforeCompile 而不是自己写 ShaderMaterial：阴影、雾、色调映射、
 * 环境光遮蔽这些标准管线的东西全都保留。
 */
export class LightmapMaterial extends MeshStandardMaterial {
  constructor({ maps = [], scales = [], ...rest } = {}) {
    super(rest)

    // 三张贴图 × 三通道 = 九盏灯，颜色按同样顺序排
    this.userData.lm = {
      maps: maps.map((m) => ({ value: m })),
      scales: scales.map((s) => ({ value: s })),        // 每通道的归一化系数
      intensity: [0, 1, 2].map(() => ({ value: [0, 0, 0] })),
      colors: { value: Array.from({ length: 9 }, () => new Color(1, 1, 1)) },
    }

    this.onBeforeCompile = (shader) => {
      const u = this.userData.lm
      u.maps.forEach((m, i) => (shader.uniforms[`uLightmap${i}`] = m))
      u.scales.forEach((s, i) => (shader.uniforms[`uLmScale${i}`] = s))
      u.intensity.forEach((v, i) => (shader.uniforms[`uLmInt${i}`] = v))
      shader.uniforms.uLmColors = u.colors

      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>
          attribute vec2 uv1;
          varying vec2 vLightmapUv;`)
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          vLightmapUv = uv1;`)

      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
          uniform sampler2D uLightmap0;
          uniform sampler2D uLightmap1;
          uniform sampler2D uLightmap2;
          uniform vec3 uLmScale0;
          uniform vec3 uLmScale1;
          uniform vec3 uLmScale2;
          uniform vec3 uLmInt0;
          uniform vec3 uLmInt1;
          uniform vec3 uLmInt2;
          uniform vec3 uLmColors[9];
          varying vec2 vLightmapUv;`)
        // 叠加在直接光之后、色调映射之前
        .replace('#include <aomap_fragment>', `#include <aomap_fragment>
          {
            vec3 a0 = texture2D(uLightmap0, vLightmapUv).rgb * uLmScale0 * uLmInt0;
            vec3 a1 = texture2D(uLightmap1, vLightmapUv).rgb * uLmScale1 * uLmInt1;
            vec3 a2 = texture2D(uLightmap2, vLightmapUv).rgb * uLmScale2 * uLmInt2;
            vec3 baked =
                a0.r * uLmColors[0] + a0.g * uLmColors[1] + a0.b * uLmColors[2]
              + a1.r * uLmColors[3] + a1.g * uLmColors[4] + a1.b * uLmColors[5]
              + a2.r * uLmColors[6] + a2.g * uLmColors[7] + a2.b * uLmColors[8];
            reflectedLight.indirectDiffuse += baked * diffuseColor.rgb;
          }`)
    }
  }

  /** slot 0..8，对应 atlas0.R … atlas2.B */
  setLamp(slot, intensity, color) {
    const u = this.userData.lm
    u.intensity[Math.floor(slot / 3)].value[slot % 3] = intensity
    if (color) u.colors.value[slot].copy(color)
  }
}
