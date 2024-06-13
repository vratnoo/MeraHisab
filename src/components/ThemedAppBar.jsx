import { Appbar,useTheme } from 'react-native-paper';
import {StatusBar,useColorScheme} from 'react-native'

const ThemedAppBar = ({children}) => {
  const theme = useTheme();
  const appBarColor = theme.colors.background;
  const colorScheme=  useColorScheme()
  const isDarkModeEnabled = colorScheme==='dark'

  return (
    <>
      <StatusBar animated={true}
        backgroundColor={theme.colors.elevation.level2}
        barStyle={isDarkModeEnabled ? 'light-content':'dark-content'}/>
      <Appbar.Header elevated={5} mode='center-aligned'>
        {children}
      </Appbar.Header>
    </>
  );
};


export default ThemedAppBar