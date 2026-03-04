import { addons } from '@storybook/manager-api';
import { rycTheme } from './RycTheme';

addons.setConfig({
  theme: rycTheme,
});

// Register the mode toggle addon
import './mode-addon/register';
