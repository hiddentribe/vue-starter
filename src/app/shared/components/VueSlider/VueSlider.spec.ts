import { mount, createLocalVue } from '@vue/test-utils';
import VueSlider from './VueSlider.vue';
import $style from 'identity-obj-proxy';

const localVue = createLocalVue();

describe('VueSlider.vue', () => {

  test('renders component', () => {
    const wrapper = mount(VueSlider, { localVue, mocks: { $style } });

    expect(wrapper.find('h1').text()).toBe('VueSlider');
  });

});
