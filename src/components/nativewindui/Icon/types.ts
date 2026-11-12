import type MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import type MaterialIcons from "@react-native-vector-icons/material-icons/static";
import type { SymbolViewProps } from 'expo-symbols';
import type { IconMapper } from 'rn-icon-mapper';

type MaterialCommunityIconsProps = React.ComponentProps<
  typeof MaterialCommunityIcons
>;
type MaterialIconsProps = React.ComponentProps<typeof MaterialIcons>;

type Style = SymbolViewProps['style'] &
  MaterialIconsProps['style'] &
  MaterialCommunityIconsProps['style'];

type IconProps = IconMapper<
  SymbolViewProps,
  MaterialIconsProps,
  MaterialCommunityIconsProps
> & {
  style?: Style;
  className?: string;
};

export type { IconProps };
