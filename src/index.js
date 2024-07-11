/*import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ChakraProvider, extendTheme} from '@chakra-ui/react'

const theme = extendTheme({
  components: {
      Drawer: {
          variants: {
              permanent: {
                  overlay: {
                    pointerEvents: 'none',
                    background: 'transparent',
                  },
                  dialog: {
                      pointerEvents: 'auto',
                  },
                  dialogContainer: {
                      pointerEvents: 'none',
                      background: 'transparent',
                  },
              },
          },
      },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </React.StrictMode>
)