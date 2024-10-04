import * as examples from '../src/examples';

export type ExamplesKey = keyof typeof examples | 'E2E';

export interface Example {
  icon?: React.JSX.Element;
  title: string;
  samples: React.FC[];
  missingOnFabric?: boolean;
  shouldBeRenderInView?: boolean;
}

export type Examples = Record<string, Example>;
