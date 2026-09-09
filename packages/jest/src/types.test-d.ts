import { expect } from "expect";
import { contrastLens } from "./index";

expect(contrastLens(document)).toHaveNoViolations();
