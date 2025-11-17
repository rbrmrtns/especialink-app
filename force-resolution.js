const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroidResolutionStrategy(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents += `
        allprojects {
            configurations.all {
                resolutionStrategy {
                    force "androidx.core:core:1.13.1"
                    force "androidx.core:core-ktx:1.13.1"
                }
            }
        }
      `;
    }
    return config;
  });
};