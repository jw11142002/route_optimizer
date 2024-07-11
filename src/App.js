import React from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import Header from './components/Header/Header';
//import List from './components/Sidebar/Sidebar';
//import Map from './components/Map/Map';
import Mapper from './components/Mapper/Mapper';
import Map1 from './components/Map/Map1';


const App = () => {
    return (
        // <>
        //     <CssBaseline />
        //     <Header />
        //     <Grid container spacing={3} style={{ width: '100%' }}>
        //         <Grid item xs={12} md={4}>
        //             <List />
        //         </Grid>
        //         <Grid item xs={12} md={8}>
        //             <Map />
        //         </Grid>
        //     </Grid>
        // </>
        <>
            <CssBaseline />
            {/* <Header /> */}
            {/* <Mapper /> */}
            <Map1 />
        </>
    );
}

export default App;