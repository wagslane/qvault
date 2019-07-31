import { nodeAPI } from '../scripts/preload';

// inject the nodeAPI reference for testing
global.window = {
  nodeAPI
};
