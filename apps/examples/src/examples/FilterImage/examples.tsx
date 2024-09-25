import * as LocalImage from './LocalImage';
import * as RemoteImage from './RemoteImage';
import * as FilterPicker from './FilterPicker';
import {Example} from '../../examples';
export {LocalImage, RemoteImage, FilterPicker};

export const EXAMPLES: Record<string, Example> = {
  LocalImageExample: {
    icon: LocalImage.icon,
    title: 'LocalImage',
    samples: LocalImage.samples,
  },
  RemoteImageExample: {
    icon: RemoteImage.icon,
    title: 'RemoteImage',
    samples: RemoteImage.samples,
  },
  FilterPickerExample: {
    icon: FilterPicker.icon,
    title: 'FilterPicker',
    samples: FilterPicker.samples,
  },
};
