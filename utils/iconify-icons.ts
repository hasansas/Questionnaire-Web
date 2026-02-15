// utils/iconify-icons.ts
import { h } from 'vue'
import type { IconSet, IconProps } from 'vuetify'
import { Icon as IconifyIcon } from '@iconify/vue' // Renamed to avoid conflict with Vuetify's 'Icon'

const iconify: IconSet = {
  component: (props: IconProps) => {
    if (typeof props.icon !== 'string') return null
    // You can pass specific props to the IconifyIcon component if needed
    // For example, to control width/height or color if not handled by Vuetify's props
    return h(IconifyIcon, {
      icon: props.icon,
      // You can also pass other props from Vuetify if they map to Iconify's props
      // For example, Vuetify's size prop could map to Iconify's width/height:
      // width: props.size,
      // height: props.size,
      // This is important: Vuetify usually applies color via CSS.
      // If you want to explicitly pass color to Iconify, you might need to handle it here.
      // For most cases, let Vuetify's styling handle it.
    })
  },
}

// Optional: Define aliases for commonly used Iconify icons
// This allows you to use shorter names for icons inside Vuetify components
// Example: { edit: 'mdi:pencil' } -> <v-icon icon="$edit"></v-icon>
const iconifyAliases = {
  // You can define aliases here if you want to map Vuetify's default aliases
  // to Iconify icons or create your own custom aliases.
  // For instance, if you want $vuetify to use an Iconify icon:
  // vuetify: 'mdi:vuetify', // Assuming 'mdi:vuetify' exists in Iconify
  // or your custom icons:
  // myCustomIcon: 'tabler:brand-tabler',
}

export { iconify, iconifyAliases }