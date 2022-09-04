import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        contrastThreshold: 3,
    },
});

export default theme;