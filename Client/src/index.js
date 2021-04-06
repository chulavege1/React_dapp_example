import React from 'react'; import ReactDOM from 'react-dom'; import { BrowserRouter, HashRouter } from 'react-router-dom'; 
// -----------------------------------
import CreateToken from './Components/dappTickets/Cryptoapp';
import GlobalStyles from '~CSS/Styled/global';
// // -----------------------------------Redux
// import { Provider } from 'react-redux'; 
// import { store } from '~Redux/store';
// style

// -----------------------------------
ReactDOM.render(
  <>
      <HashRouter>
        <CreateToken />
      </HashRouter>
  </>
,document.getElementById('ReactComponentsContainer')
);