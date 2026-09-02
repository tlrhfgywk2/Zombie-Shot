const ciBuildSha = import.meta.env.VITE_BUILD_SHA?.trim();

export const BUILD_ID = ciBuildSha ? ciBuildSha.slice(0, 7) : 'LOCAL';
export const BUILD_LABEL = `BUILD ${BUILD_ID}`;
