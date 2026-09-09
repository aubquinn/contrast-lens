import { expect } from 'expect';
import { contrastLens } from './index.js';

expect(contrastLens(document)).toHaveNoViolations();
