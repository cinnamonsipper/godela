import React from 'react';
import { Layout } from './components/Layout';
import { ModelViewer } from './components/ModelViewer';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Layout>
        <ModelViewer />
      </Layout>
    </AppProvider>
  );
}

export default App;