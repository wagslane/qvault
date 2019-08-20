import { nodeAPI } from '../main/preload';

// inject the nodeAPI reference for testing
global.window = {
  nodeAPI
};
