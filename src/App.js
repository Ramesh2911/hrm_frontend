import './App.css';
import Common from './helpers/common';
import Router from './router/Router';
import 'react-toastify/dist/ReactToastify.css';

function App(props) {

  return (
    <div className="App">
      <Router {...props} />
    </div>
  );
}

export default Common(App);
