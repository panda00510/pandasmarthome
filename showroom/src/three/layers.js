// 烘焙壳体放在 layer 1，室内点光源照不到它，避免和烘焙光叠成双份。
// 单独成文件，这样不挂 BakedShell 时主包不会把旧 lightmap 一并打进来。
export const SHELL_LAYER = 1
